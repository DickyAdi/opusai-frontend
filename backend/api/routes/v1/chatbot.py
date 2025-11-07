from fastapi import APIRouter, UploadFile
from typing import Optional

router = APIRouter(prefix='/ai')


@router.post('/chat')
async def chatbot(prompt:str, pdf_file:Optional[UploadFile]=None):
    return {
        'msg': 'Hai from chatbot endpoint'
    }