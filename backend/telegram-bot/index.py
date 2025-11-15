import json
import os
import requests
from typing import Dict, Any

BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
TELEGRAM_API = f'https://api.telegram.org/bot{BOT_TOKEN}'

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send product codes to users via Telegram after payment
    Args: event - dict with httpMethod, body
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        telegram_user_id = body_data.get('telegram_user_id')
        codes = body_data.get('codes', [])
        order_id = body_data.get('order_id')
        
        message = f"🎉 *Оплата успешна!*\n\n"
        message += f"Заказ #{order_id}\n\n"
        message += "*Ваши коды:*\n\n"
        
        for item in codes:
            message += f"🎮 *{item['product_name']}*\n"
            message += f"`{item['code']}`\n\n"
        
        message += "Спасибо за покупку! 🚀"
        
        response = requests.post(
            f'{TELEGRAM_API}/sendMessage',
            json={
                'chat_id': telegram_user_id,
                'text': message,
                'parse_mode': 'Markdown'
            }
        )
        
        if response.status_code == 200:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True})
            }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': response.text
                })
            }
    
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
