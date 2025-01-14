let dictionary = {
    "completed": "concluído",
    "shipped": "enviado",
    "payment-pending": "pagamento pendente",
    "processing": "em processamento",
    "waiting": "aguardando",
    "delivered": "entregue",
    "canceled": "cancelado",
} 

export function statusTranslator(status) {
    if (!Object.keys(dictionary).includes(status)) {
        return "status desconhecido"
    }
    return dictionary[status]
} 