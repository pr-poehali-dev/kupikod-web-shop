import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage orders - create, get status, assign codes
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = psycopg2.connect(os.environ.get('DATABASE_URL'))
    cur = conn.cursor()
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        items = body_data.get('items', [])
        total_price = body_data.get('total_price')
        user_email = body_data.get('user_email')
        telegram_user_id = body_data.get('telegram_user_id')
        
        cur.execute(
            "INSERT INTO orders (items, total_price, user_email, telegram_user_id) VALUES (%s, %s, %s, %s) RETURNING id",
            (json.dumps(items), total_price, user_email, telegram_user_id)
        )
        order_id = cur.fetchone()[0]
        conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'order_id': order_id})
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        order_id = params.get('order_id')
        
        if order_id:
            cur.execute(
                "SELECT id, total_price, payment_status, items, codes, created_at, paid_at FROM orders WHERE id = %s",
                (order_id,)
            )
            row = cur.fetchone()
            
            if row:
                order = {
                    'id': row[0],
                    'total_price': row[1],
                    'payment_status': row[2],
                    'items': row[3],
                    'codes': row[4],
                    'created_at': str(row[5]),
                    'paid_at': str(row[6]) if row[6] else None
                }
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(order)
                }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 404,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Order not found'})
        }
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        order_id = body_data.get('order_id')
        payment_id = body_data.get('payment_id')
        payment_status = body_data.get('payment_status')
        
        if payment_status == 'succeeded':
            cur.execute(
                "SELECT items FROM orders WHERE id = %s",
                (order_id,)
            )
            items = cur.fetchone()[0]
            
            assigned_codes = []
            for item in items:
                product_id = item['id']
                
                cur.execute(
                    "SELECT id, code FROM product_codes WHERE product_id = %s AND is_used = false LIMIT 1",
                    (product_id,)
                )
                code_row = cur.fetchone()
                
                if code_row:
                    code_id, code = code_row
                    assigned_codes.append({
                        'product_name': item['name'],
                        'code': code
                    })
                    
                    cur.execute(
                        "UPDATE product_codes SET is_used = true, used_at = CURRENT_TIMESTAMP, order_id = %s WHERE id = %s",
                        (order_id, code_id)
                    )
            
            cur.execute(
                "UPDATE orders SET payment_status = %s, payment_id = %s, codes = %s, paid_at = CURRENT_TIMESTAMP WHERE id = %s",
                (payment_status, payment_id, json.dumps(assigned_codes), order_id)
            )
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'codes': assigned_codes
                })
            }
        else:
            cur.execute(
                "UPDATE orders SET payment_status = %s, payment_id = %s WHERE id = %s",
                (payment_status, payment_id, order_id)
            )
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True})
            }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
