import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let currentCategory = 'TI';
let isAdminLoggedIn = false;
let adminSession = null;

function showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = isError ? 'error' : 'success';

    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function linkifyText(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #22d3ee; text-decoration: underline;">${url}</a>`;
    });
}

window.switchForumTab = function(category) {
    currentCategory = category;
    document.getElementById('question-category').value = category;

    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.closest('.tab-btn').classList.add('active');

    loadQuestions();
};

window.toggleAdminLogin = function() {
    const modal = document.getElementById('admin-login-modal');
    modal.classList.add('show');
};

window.closeAdminLogin = function() {
    const modal = document.getElementById('admin-login-modal');
    modal.classList.remove('show');
};

window.closeAnswerModal = function() {
    const modal = document.getElementById('admin-answer-modal');
    modal.classList.remove('show');
};

window.handleAdminLogin = async function(event) {
    event.preventDefault();

    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    try {
        const { data: adminData, error } = await supabase
            .from('forum_admin')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error) throw error;

        if (!adminData) {
            showMessage('admin-login-message', 'Credenciais inválidas', true);
            return;
        }

        const passwordMatch = await verifyPassword(password, adminData.password_hash);

        if (!passwordMatch) {
            showMessage('admin-login-message', 'Credenciais inválidas', true);
            return;
        }

        isAdminLoggedIn = true;
        adminSession = adminData;

        const adminBtn = document.getElementById('admin-toggle-btn');
        adminBtn.innerHTML = `<i class="fas fa-user-check"></i> Logado: ${adminData.name}`;
        adminBtn.classList.add('active');

        closeAdminLogin();
        loadQuestions();

        showMessage('admin-login-message', 'Login realizado com sucesso!');
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showMessage('admin-login-message', 'Erro ao fazer login. Tente novamente.', true);
    }
};

async function verifyPassword(password, hash) {
    return password === hash;
}

window.handleQuestionSubmit = async function(event) {
    event.preventDefault();

    const author = document.getElementById('question-author').value;
    const email = document.getElementById('question-email').value;
    const title = document.getElementById('question-title').value;
    const content = document.getElementById('question-content').value;
    const imageUrl = document.getElementById('question-image').value;
    const category = document.getElementById('question-category').value;

    try {
        const { data, error } = await supabase
            .from('forum_questions')
            .insert([
                {
                    category: category,
                    author_name: author,
                    author_email: email,
                    title: title,
                    content: content,
                    image_url: imageUrl || null,
                    status: 'pending'
                }
            ]);

        if (error) throw error;

        showMessage('question-message', 'Pergunta enviada com sucesso! Aguarde a resposta do administrador.');

        document.getElementById('forum-question-form').reset();
        document.getElementById('question-category').value = currentCategory;

        loadQuestions();
    } catch (error) {
        console.error('Erro ao enviar pergunta:', error);
        showMessage('question-message', 'Erro ao enviar pergunta. Tente novamente.', true);
    }
};

window.openAnswerModal = function(questionId, questionTitle, questionContent) {
    const modal = document.getElementById('admin-answer-modal');
    const preview = document.getElementById('answer-question-preview');

    preview.innerHTML = `
        <h4>${questionTitle}</h4>
        <p>${questionContent}</p>
    `;

    document.getElementById('answer-question-id').value = questionId;
    document.getElementById('answer-content').value = '';
    document.getElementById('answer-image').value = '';

    modal.classList.add('show');
};

window.handleAnswerSubmit = async function(event) {
    event.preventDefault();

    if (!isAdminLoggedIn || !adminSession) {
        showMessage('answer-message', 'Você precisa estar logado como admin para responder.', true);
        return;
    }

    const questionId = document.getElementById('answer-question-id').value;
    const content = document.getElementById('answer-content').value;
    const imageUrl = document.getElementById('answer-image').value;

    try {
        const { data: answerData, error: answerError } = await supabase
            .from('forum_answers')
            .insert([
                {
                    question_id: questionId,
                    admin_name: adminSession.name,
                    content: content,
                    image_url: imageUrl || null
                }
            ]);

        if (answerError) throw answerError;

        const { error: updateError } = await supabase
            .from('forum_questions')
            .update({ status: 'answered' })
            .eq('id', questionId);

        if (updateError) throw updateError;

        showMessage('answer-message', 'Resposta enviada com sucesso!');

        setTimeout(() => {
            closeAnswerModal();
            loadQuestions();
        }, 2000);
    } catch (error) {
        console.error('Erro ao enviar resposta:', error);
        showMessage('answer-message', 'Erro ao enviar resposta. Tente novamente.', true);
    }
};

async function loadQuestions() {
    const listContainer = document.getElementById('forum-questions-list');
    listContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando perguntas...</div>';

    try {
        const { data: questions, error: questionsError } = await supabase
            .from('forum_questions')
            .select('*')
            .eq('category', currentCategory)
            .order('created_at', { ascending: false });

        if (questionsError) throw questionsError;

        if (!questions || questions.length === 0) {
            listContainer.innerHTML = '<div class="loading">Nenhuma pergunta encontrada nesta categoria.</div>';
            return;
        }

        const questionsHTML = await Promise.all(questions.map(async (question) => {
            const { data: answers } = await supabase
                .from('forum_answers')
                .select('*')
                .eq('question_id', question.id)
                .order('created_at', { ascending: true });

            const answersHTML = answers && answers.length > 0 ? answers.map(answer => `
                <div class="admin-answer-section">
                    <div class="answer-header">
                        <i class="fas fa-user-shield"></i>
                        <strong>Resposta do Admin</strong>
                    </div>
                    <div class="answer-admin">Por: ${answer.admin_name} • ${formatDate(answer.created_at)}</div>
                    <div class="answer-content">${linkifyText(answer.content)}</div>
                    ${answer.image_url ? `<img src="${answer.image_url}" alt="Imagem da resposta" class="answer-image">` : ''}
                </div>
            `).join('') : '';

            const adminActions = isAdminLoggedIn && question.status === 'pending' ? `
                <div class="question-actions">
                    <button class="btn btn-primary" onclick="openAnswerModal('${question.id}', '${question.title.replace(/'/g, "\\'")}', '${question.content.replace(/'/g, "\\'")}')">
                        <i class="fas fa-reply"></i>
                        Responder
                    </button>
                </div>
            ` : '';

            return `
                <div class="question-card">
                    <div class="question-header">
                        <div class="question-meta">
                            <h4 class="question-title">${question.title}</h4>
                            <div class="question-author">Por: ${question.author_name}</div>
                            <div class="question-date">${formatDate(question.created_at)}</div>
                        </div>
                        <span class="question-status ${question.status}">${
                            question.status === 'pending' ? 'Aguardando' :
                            question.status === 'answered' ? 'Respondida' :
                            'Fechada'
                        }</span>
                    </div>
                    <div class="question-content">${linkifyText(question.content)}</div>
                    ${question.image_url ? `<img src="${question.image_url}" alt="Imagem da pergunta" class="question-image">` : ''}
                    ${adminActions}
                    ${answersHTML}
                </div>
            `;
        }));

        listContainer.innerHTML = questionsHTML.join('');
    } catch (error) {
        console.error('Erro ao carregar perguntas:', error);
        listContainer.innerHTML = '<div class="loading">Erro ao carregar perguntas. Tente novamente.</div>';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadQuestions();

    window.addEventListener('click', (event) => {
        const adminModal = document.getElementById('admin-login-modal');
        const answerModal = document.getElementById('admin-answer-modal');

        if (event.target === adminModal) {
            closeAdminLogin();
        }

        if (event.target === answerModal) {
            closeAnswerModal();
        }
    });
});
