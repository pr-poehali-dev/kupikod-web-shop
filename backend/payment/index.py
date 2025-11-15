import json
import os
import uuid
from typing import Dict, Any
from yookassa import Configuration, Payment

Configuration.account_id = os.environ.get('YOOKASSA_SHOP_ID')
Configuration.secret_key = os.environ.get('YOOKASSA_SECRET_KEY')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create payment and process payment confirmations
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action', 'create')
        
        if action == 'create':
            amount = body_data.get('amount')
            order_id = body_data.get('order_id')
            return_url = body_data.get('return_url', 'https://kupikod.ru')
            
            idempotence_key = str(uuid.uuid4())
            
            payment = Payment.create({
                "amount": {
                    "value": f"{amount}.00",
                    "currency": "RUB"
                },
                "confirmation": {
                    "type": "redirect",
                    "return_url": return_url
                },
                "capture": True,
                "description": f"Заказ #{order_id}",
                "metadata": {
                    "order_id": order_id
                }
            }, idempotence_key)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'payment_id': payment.id,
                    'confirmation_url': payment.confirmation.confirmation_url,
                    'status': payment.status
                })
            }
        
        if action == 'check':
            payment_id = body_data.get('payment_id')
            payment = Payment.find_one(payment_id)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'payment_id': payment.id,
                    'status': payment.status,
                    'paid': payment.paid,
                    'amount': float(payment.amount.value)
                })
            }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
