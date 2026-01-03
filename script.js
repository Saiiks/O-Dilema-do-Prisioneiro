// ===== CONFIGURAÇÃO DO JOGO =====
class PrisionersDilemmaGame {
    constructor() {
        this.currentScene = 1;
        this.totalScenes = 5;
        this.playerChoices = [];
        
        // Dados das cenas
        this.scenes = [
            {
                id: 1,
                image: 'img/1.jpg',
                text: 'Dois prisioneiros aguardam interrogatório...',
                hasChoice: false
            },
            {
                id: 2,
                image: 'img/Gemini_Generated_Image_embvteembvteembv1.png',
                text: 'Você é acusado de um crime junto com seu cúmplice.',
                hasChoice: false
            },
            {
                id: 3,
                image: 'img/Gemini_Generated_Image_embvteembvteembv2.png',
                text: 'O promotor oferece um acordo separadamente:',
                hasChoice: false
            },
            {
                id: 4,
                image: 'img/Gemini_Generated_Image_embvteembvteembv.png',
                text: 'Se ambos cooperarem: recebem 2 anos de cadeia cada.\nSe um trair e outro cooperar: o traidor fica livre, o cooperador recebe 5 anos de cadeia.\nSe ambos traírem: recebem 4 anos de cadeia cada.',
                hasChoice: false
            },
            {
                id: 5,
                image: 'images/cena5.jpg',
                text: 'O que você faz?',
                hasChoice: true
            }
        ];
        
        this.init();
    }
    
    // ===== INICIALIZAÇÃO =====
    init() {
        this.cacheElements();
        this.bindEvents();
        this.updateScene();
    }
    
    // ===== CACHE DE ELEMENTOS DOM =====
    cacheElements() {
        // Elementos principais
        this.sceneImage = document.getElementById('scene-image');
        this.dialogText = document.getElementById('dialog-text');
        this.continueBtn = document.getElementById('continue-btn');
        this.cooperateBtn = document.getElementById('cooperate-btn');
        this.betrayBtn = document.getElementById('betray-btn');
        
        // Containers
        this.dialogBox = document.getElementById('dialog-box');
        this.choicesBox = document.getElementById('choices-box');
        
        // Progresso
        this.progressDots = document.querySelectorAll('.progress-dot');
    }
    
    // ===== VINCULAÇÃO DE EVENTOS =====
    bindEvents() {
        // Botão Continuar
        this.continueBtn.addEventListener('click', () => this.nextScene());
        
        // Botões de escolha
        this.cooperateBtn.addEventListener('click', () => this.makeChoice('cooperate'));
        this.betrayBtn.addEventListener('click', () => this.makeChoice('betray'));
        
        // Pontos de progresso (clique para navegar)
        this.progressDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const sceneId = parseInt(e.target.dataset.scene);
                this.goToScene(sceneId);
            });
        });
    }
    
    // ===== ATUALIZAÇÃO DE CENA =====
    updateScene() {
        const scene = this.scenes[this.currentScene - 1];
        
        // Atualiza imagem
        this.sceneImage.src = scene.image;
        this.sceneImage.alt = `Cena ${this.currentScene}`;
        
        // Atualiza texto
        this.dialogText.textContent = scene.text;
        
        // Mostra/Esconde elementos conforme necessidade
        if (scene.hasChoice) {
            this.dialogBox.classList.add('hidden');
            this.choicesBox.classList.remove('hidden');
        } else {
            this.dialogBox.classList.remove('hidden');
            this.choicesBox.classList.add('hidden');
        }
        
        // Atualiza indicador de progresso
        this.updateProgressDots();
        
        // Animação de transição
        this.animateTransition();
    }
    
    // ===== PRÓXIMA CENA =====
    nextScene() {
        if (this.currentScene < this.totalScenes) {
            this.currentScene++;
            this.updateScene();
        }
    }
    
    // ===== IR PARA CENA ESPECÍFICA =====
    goToScene(sceneId) {
        if (sceneId >= 1 && sceneId <= this.totalScenes) {
            this.currentScene = sceneId;
            this.updateScene();
        }
    }
    
    // ===== FAZER ESCOLHA =====
    makeChoice(choice) {
        const scene = this.scenes[this.currentScene - 1];
        
        if (!scene.hasChoice) return;
        
        // Registra escolha
        this.playerChoices.push({
            scene: this.currentScene,
            choice: choice,
            timestamp: new Date().toISOString()
        });
        
        // Efeito visual no botão clicado
        const button = choice === 'cooperate' ? this.cooperateBtn : this.betrayBtn;
        this.animateButtonClick(button);
        
        // Determina consequência
        const consequence = this.calculateConsequence(choice);
        
        // Mostra resultado
        setTimeout(() => {
            this.showResult(consequence);
        }, 500);
    }
    
    // ===== CALCULAR CONSEQUÊNCIA =====
    calculateConsequence(playerChoice) {
        // Lógica do Dilema do Prisioneiro
        // Simulação: o cúmplice tem 70% de chance de cooperar, 30% de trair
        const partnerChoice = Math.random() < 0.7 ? 'cooperate' : 'betray';
        
        const outcomes = {
            'cooperate-cooperate': {
                title: 'Ambos Cooperaram!',
                message: 'Vocês recebem 2 anos de prisão cada.',
                years: 2,
                color: '#2e8b57'
            },
            'cooperate-betray': {
                title: 'Você cooperou, mas foi traído!',
                message: 'Você recebe 5 anos. Seu cúmplice sai livre.',
                years: 5,
                color: '#b22222'
            },
            'betray-cooperate': {
                title: 'Você traiu!',
                message: 'Você sai livre. Seu cúmplice recebe 5 anos.',
                years: 0,
                color: '#ff8c00'
            },
            'betray-betray': {
                title: 'Ambos traíram!',
                message: 'Vocês recebem 4 anos de prisão cada.',
                years: 4,
                color: '#8b0000'
            }
        };
        
        const outcomeKey = `${playerChoice}-${partnerChoice}`;
        return {
            ...outcomes[outcomeKey],
            partnerChoice: partnerChoice
        };
    }
    
    // ===== MOSTRAR RESULTADO =====
    showResult(consequence) {
        // Atualiza o diálogo com o resultado
        this.dialogText.innerHTML = `
            <strong style="color: ${consequence.color}; font-size: 1.4em;">${consequence.title}</strong><br><br>
            ${consequence.message}<br><br>
            <em>Seu cúmplice escolheu: ${consequence.partnerChoice === 'cooperate' ? 'Cooperar' : 'Trair'}</em>
        `;
        
        // Muda para tela de resultado
        this.choicesBox.classList.add('hidden');
        this.dialogBox.classList.remove('hidden');
        
        // Muda o botão para "Jogar Novamente"
        this.continueBtn.textContent = 'Jogar Novamente';
        this.continueBtn.removeEventListener('click', () => this.nextScene());
        this.continueBtn.addEventListener('click', () => this.restartGame(), { once: true });
        
        // Atualiza a imagem para uma cena de resultado
        this.sceneImage.src = consequence.years === 0 ? 
            'images/result-free.jpg' : 
            `images/result-${consequence.years}years.jpg`;
    }
    
    // ===== REINICIAR JOGO =====
    restartGame() {
        this.currentScene = 1;
        this.playerChoices = [];
        this.continueBtn.textContent = 'Continuar';
        this.continueBtn.removeEventListener('click', () => this.restartGame());
        this.continueBtn.addEventListener('click', () => this.nextScene());
        this.updateScene();
    }
    
    // ===== ATUALIZAR PONTOS DE PROGRESSO =====
    updateProgressDots() {
        this.progressDots.forEach(dot => {
            const dotScene = parseInt(dot.dataset.scene);
            
            if (dotScene === this.currentScene) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
            
            if (dotScene <= this.currentScene) {
                dot.style.opacity = '1';
            } else {
                dot.style.opacity = '0.5';
            }
        });
    }
    
    // ===== ANIMAÇÕES =====
    animateTransition() {
        // Efeito de fade na imagem
        this.sceneImage.style.opacity = '0';
        setTimeout(() => {
            this.sceneImage.style.opacity = '1';
        }, 50);
        
        // Efeito de entrada nos containers
        const container = this.scenes[this.currentScene - 1].hasChoice ? 
            this.choicesBox : this.dialogBox;
        
        container.style.animation = 'none';
        setTimeout(() => {
            container.style.animation = 'fadeIn 0.5s ease-out';
        }, 10);
    }
    
    animateButtonClick(button) {
        button.style.transform = 'scale(0.95)';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        
        setTimeout(() => {
            button.style.transform = '';
            button.style.boxShadow = '';
        }, 200);
    }
    
    // ===== GETTER PARA HISTÓRICO =====
    getGameHistory() {
        return {
            totalChoices: this.playerChoices.length,
            choices: this.playerChoices,
            currentScene: this.currentScene
        };
    }
}

// ===== INICIALIZAÇÃO DO JOGO =====
document.addEventListener('DOMContentLoaded', () => {
    const game = new PrisionersDilemmaGame();
    
    // Para debugging (opcional)
    window.game = game;
    
    // Log inicial
    console.log('🎮 Jogo "O Dilema do Prisioneiro" iniciado!');
    console.log('Use window.game.getGameHistory() para ver o histórico');
});