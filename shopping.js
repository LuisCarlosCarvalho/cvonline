import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let currentListId = null;
let currentListItems = [];

window.switchProject = function(projectName) {
    document.querySelectorAll('.project-menu-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.project-content').forEach(content => content.classList.remove('active'));

    event.target.closest('.project-menu-btn').classList.add('active');
    document.getElementById(`project-${projectName}`).classList.add('active');

    if (projectName === 'shopping') {
        loadShoppingLists();
    }
};

window.showNewListModal = function() {
    document.getElementById('new-list-modal').classList.add('show');
    document.getElementById('new-list-name').value = '';
};

window.closeNewListModal = function() {
    document.getElementById('new-list-modal').classList.remove('show');
};

window.showAddItemModal = function() {
    if (!currentListId) {
        alert('Selecione uma lista primeiro!');
        return;
    }
    document.getElementById('add-item-modal').classList.add('show');
    document.getElementById('add-item-form').reset();
};

window.closeAddItemModal = function() {
    document.getElementById('add-item-modal').classList.remove('show');
};

window.createNewList = async function(event) {
    event.preventDefault();

    const name = document.getElementById('new-list-name').value;

    try {
        const { data, error } = await supabase
            .from('shopping_lists')
            .insert([{ name }])
            .select()
            .single();

        if (error) throw error;

        closeNewListModal();
        await loadShoppingLists();
        selectList(data.id);
    } catch (error) {
        console.error('Erro ao criar lista:', error);
        alert('Erro ao criar lista. Tente novamente.');
    }
};

window.addNewItem = async function(event) {
    event.preventDefault();

    const name = document.getElementById('new-item-name').value;
    const quantity = parseInt(document.getElementById('new-item-quantity').value);
    const unit = document.getElementById('new-item-unit').value;
    const price = parseFloat(document.getElementById('new-item-price').value) || null;

    try {
        const { error } = await supabase
            .from('shopping_items')
            .insert([{
                list_id: currentListId,
                name,
                quantity,
                unit,
                price
            }]);

        if (error) throw error;

        closeAddItemModal();
        loadListItems(currentListId);
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        alert('Erro ao adicionar item. Tente novamente.');
    }
};

window.deleteCurrentList = async function() {
    if (!currentListId) return;

    if (!confirm('Tem certeza que deseja excluir esta lista?')) return;

    try {
        const { error } = await supabase
            .from('shopping_lists')
            .delete()
            .eq('id', currentListId);

        if (error) throw error;

        currentListId = null;
        document.getElementById('shopping-list-content').style.display = 'none';
        document.getElementById('shopping-empty-state').style.display = 'flex';
        loadShoppingLists();
    } catch (error) {
        console.error('Erro ao excluir lista:', error);
        alert('Erro ao excluir lista. Tente novamente.');
    }
};

async function loadShoppingLists() {
    const container = document.getElementById('shopping-lists-container');
    container.innerHTML = '<div class="loading-small"><i class="fas fa-spinner fa-spin"></i> Carregando...</div>';

    try {
        const { data: lists, error } = await supabase
            .from('shopping_lists')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!lists || lists.length === 0) {
            container.innerHTML = '<div class="empty-lists"><i class="fas fa-inbox"></i><p>Nenhuma lista ainda</p></div>';
            return;
        }

        container.innerHTML = lists.map(list => `
            <div class="shopping-list-item ${list.id === currentListId ? 'active' : ''}" onclick="selectList('${list.id}')">
                <i class="fas fa-list-ul"></i>
                <div>
                    <strong>${list.name}</strong>
                    <small>${new Date(list.created_at).toLocaleDateString('pt-BR')}</small>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar listas:', error);
        container.innerHTML = '<div class="empty-lists"><p>Erro ao carregar listas</p></div>';
    }
}

window.selectList = async function(listId) {
    currentListId = listId;

    document.querySelectorAll('.shopping-list-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.shopping-list-item')?.classList.add('active');

    const { data: list } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('id', listId)
        .single();

    if (list) {
        document.getElementById('current-list-name').textContent = list.name;
    }

    document.getElementById('shopping-empty-state').style.display = 'none';
    document.getElementById('shopping-list-content').style.display = 'block';

    loadListItems(listId);
};

async function loadListItems(listId) {
    const container = document.getElementById('shopping-items-container');
    container.innerHTML = '<div class="loading-small"><i class="fas fa-spinner fa-spin"></i> Carregando itens...</div>';

    try {
        const { data: items, error } = await supabase
            .from('shopping_items')
            .select('*')
            .eq('list_id', listId)
            .order('is_completed', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) throw error;

        currentListItems = items || [];

        if (!items || items.length === 0) {
            container.innerHTML = '<div class="empty-items"><i class="fas fa-shopping-basket"></i><p>Nenhum item ainda. Clique no + para adicionar.</p></div>';
            updateSummary([], 0, 0);
            return;
        }

        const totalItems = items.length;
        const completedItems = items.filter(item => item.is_completed).length;
        const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity || 0), 0);

        container.innerHTML = items.map(item => `
            <div class="shopping-item ${item.is_completed ? 'completed' : ''}">
                <div class="item-checkbox">
                    <input type="checkbox" ${item.is_completed ? 'checked' : ''} onchange="toggleItemComplete('${item.id}', this.checked)">
                </div>
                <div class="item-details">
                    <strong>${item.name}</strong>
                    <span class="item-quantity">${item.quantity} ${item.unit}</span>
                    ${item.price ? `<span class="item-price">R$ ${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>` : ''}
                </div>
                <button class="btn-icon btn-danger-small" onclick="deleteItem('${item.id}')" title="Remover">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        updateSummary(items, totalItems, completedItems, totalPrice);
    } catch (error) {
        console.error('Erro ao carregar itens:', error);
        container.innerHTML = '<div class="empty-items"><p>Erro ao carregar itens</p></div>';
    }
}

function updateSummary(items, totalItems, completedItems, totalPrice) {
    document.getElementById('current-list-info').textContent = `${totalItems} itens • R$ ${totalPrice.toFixed(2)}`;
    document.getElementById('summary-total-items').textContent = totalItems;
    document.getElementById('summary-completed-items').textContent = completedItems;
    document.getElementById('summary-total-price').textContent = `R$ ${totalPrice.toFixed(2)}`;
}

window.toggleItemComplete = async function(itemId, isCompleted) {
    try {
        const { error } = await supabase
            .from('shopping_items')
            .update({ is_completed: isCompleted })
            .eq('id', itemId);

        if (error) throw error;

        loadListItems(currentListId);
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
    }
};

window.deleteItem = async function(itemId) {
    if (!confirm('Remover este item?')) return;

    try {
        const { error } = await supabase
            .from('shopping_items')
            .delete()
            .eq('id', itemId);

        if (error) throw error;

        loadListItems(currentListId);
    } catch (error) {
        console.error('Erro ao remover item:', error);
        alert('Erro ao remover item.');
    }
};

window.addEventListener('click', (event) => {
    const newListModal = document.getElementById('new-list-modal');
    const addItemModal = document.getElementById('add-item-modal');

    if (event.target === newListModal) closeNewListModal();
    if (event.target === addItemModal) closeAddItemModal();
});

// WhatsApp functionality
window.sendToWhatsApp = async function() {
    if (!currentListId) {
        alert('Selecione uma lista primeiro!');
        return;
    }

    const phoneInput = document.getElementById('whatsapp-number');
    let phoneNumber = phoneInput.value.replace(/\D/g, '');

    if (!phoneNumber) {
        alert('Por favor, digite seu número de WhatsApp!');
        phoneInput.focus();
        return;
    }

    if (phoneNumber.length < 10) {
        alert('Número inválido! Digite o DDD + número completo.');
        phoneInput.focus();
        return;
    }

    if (phoneNumber.length === 11 && !phoneNumber.startsWith('55')) {
        phoneNumber = '55' + phoneNumber;
    }

    if (currentListItems.length === 0) {
        alert('A lista está vazia! Adicione itens antes de enviar.');
        return;
    }

    const listName = document.getElementById('current-list-name').textContent;
    let message = `*${listName}*\n\n`;

    const pendingItems = currentListItems.filter(item => !item.is_completed);
    const completedItems = currentListItems.filter(item => item.is_completed);

    if (pendingItems.length > 0) {
        message += `*🛒 Itens para comprar:*\n`;
        pendingItems.forEach((item, index) => {
            message += `${index + 1}. ${item.name} - ${item.quantity} ${item.unit}`;
            if (item.price) {
                message += ` (R$ ${(parseFloat(item.price) * item.quantity).toFixed(2)})`;
            }
            message += `\n`;
        });
    }

    if (completedItems.length > 0) {
        message += `\n*✅ Já comprados:*\n`;
        completedItems.forEach((item, index) => {
            message += `${index + 1}. ${item.name} - ${item.quantity} ${item.unit}`;
            if (item.price) {
                message += ` (R$ ${(parseFloat(item.price) * item.quantity).toFixed(2)})`;
            }
            message += `\n`;
        });
    }

    const totalPrice = currentListItems.reduce((sum, item) => 
        sum + (parseFloat(item.price) * item.quantity || 0), 0
    );

    if (totalPrice > 0) {
        message += `\n*💰 Valor Total: R$ ${totalPrice.toFixed(2)}*`;
    }

    message += `\n\n_Lista criada em ${window.location.hostname}_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    localStorage.setItem('whatsapp_number', phoneNumber);
};

// Format phone number as user types
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('whatsapp-number');
    
    if (phoneInput) {
        const savedNumber = localStorage.getItem('whatsapp_number');
        if (savedNumber) {
            phoneInput.value = formatPhoneNumber(savedNumber);
        }

        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = formatPhoneNumber(value);
        });
    }
});

function formatPhoneNumber(value) {
    if (!value) return '';
    
    value = value.replace(/^55/, '');
    
    if (value.length <= 10) {
        return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
        return value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
}
