# Credenciais de Admin do Fórum

Para acessar o painel de administração do fórum e responder às perguntas:

## Credenciais de Login

- **Email:** admin@luiscarvalho.com
- **Senha:** admin123

## Como Usar

1. Acesse a seção "Fórum" no site
2. Clique no botão "Acesso Admin"
3. Digite as credenciais acima
4. Após o login, você verá botões "Responder" nas perguntas pendentes
5. Clique em "Responder" para abrir o modal de resposta
6. Digite sua resposta (pode incluir URLs e links)
7. Opcionalmente, adicione uma URL de imagem
8. Clique em "Enviar Resposta"

## Recursos do Fórum

### Para Usuários:
- Fazer perguntas nas categorias TI e Logística
- Visualizar todas as perguntas e respostas
- Adicionar URLs, links e imagens nas perguntas

### Para Admin:
- Responder perguntas pendentes
- Adicionar URLs, links e imagens nas respostas
- Ver todas as perguntas organizadas por categoria
- Status das perguntas atualiza automaticamente após resposta

## Segurança

IMPORTANTE: Para produção, você deve:
1. Alterar a senha padrão
2. Implementar hash de senha adequado (bcrypt)
3. Usar autenticação mais robusta

## Estrutura do Banco de Dados

O fórum utiliza três tabelas no Supabase:
- `forum_questions` - Armazena as perguntas
- `forum_answers` - Armazena as respostas do admin
- `forum_admin` - Armazena dados dos administradores
