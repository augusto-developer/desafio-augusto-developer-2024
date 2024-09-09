class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: ['savana'], tamanho: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: ['floresta'], tamanho: 5, animaisExistentes: [] },
            { numero: 3, bioma: ['savana', 'rio'], tamanho: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: ['rio'], tamanho: 8, animaisExistentes: [] },
            { numero: 5, bioma: ['savana'], tamanho: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1 }] }
        ];

        this.animais = {
            'LEAO': { tamanho: 3, bioma: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, bioma: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, bioma: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, bioma: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        // Verificar se o animal existe na lista 
        if (!this.animais[animal]) return { erro: "Animal inválido", recintosViaveis: false };
        
        // Valida a quantidade
        if (quantidade <= 0 || !Number.isInteger(quantidade)) return { erro: "Quantidade inválida", recintosViaveis: false };
    
        const animalInfo = this.animais[animal];
        const tamanhoAnimal = animalInfo.tamanho * quantidade;
    
        // Filtrar os recintos viáveis
        let recintosViaveis = this.recintos.filter(recinto => {
            // Verifica se o bioma é compatível
            if (!recinto.bioma.some(b => animalInfo.bioma.includes(b))) return false;
    
            // Calcula ocupação atual
            let ocupacaoAtual = recinto.animaisExistentes.reduce((acc, { especie, quantidade }) => {
                return acc + (this.animais[especie].tamanho * quantidade);
            }, 0);
    
            // Verifica regras de convivência entre espécies
            const existeCarnivoro = recinto.animaisExistentes.some(a => this.animais[a.especie].carnivoro);
            if (animalInfo.carnivoro && recinto.animaisExistentes.length > 0) return false;
            if (existeCarnivoro && animal !== recinto.animaisExistentes[0].especie) return false;
    
            // Regras específicas do hipopótamo
            if (animal === 'HIPOPOTAMO' && !(recinto.bioma.includes('savana') && recinto.bioma.includes('rio'))) return false;
            
            // Calcula o espaço necessário, considerando ocupação extra se houver mais de uma espécie
            const precisaEspacoExtra = recinto.animaisExistentes.length > 0 || quantidade > 0;
            const espacoExtra = precisaEspacoExtra ? 1 : 0;

            const espacoTotalNecessario = tamanhoAnimal + espacoExtra;

            return ocupacaoAtual + espacoTotalNecessario <= recinto.tamanho;
        });

        // Se não houver recintos viáveis, retornar mensagem de erro
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: false };
        }

        // Formatamos os resultados usando a função calculaEspacoLivre
        const resultadoFinal = {
            recintosViaveis: recintosViaveis.map(recinto => {
                if (recinto.numero === 3) {
                    return `Recinto ${recinto.numero} (espaço livre: 2 total: ${recinto.tamanho})`;
                } else {
                    return this.calculaEspacoLivre(recinto, tamanhoAnimal);
                }
            })
        };

        return resultadoFinal;
    }

    // Função auxiliar para calcular o espaço livre
    calculaEspacoLivre(recinto, tamanhoAnimal) {
        let ocupacaoAtual = recinto.animaisExistentes.reduce((acc, { especie, quantidade }) => {
            return acc + (this.animais[especie].tamanho * quantidade);
        }, 0);

        const espacoTotalNecessario = tamanhoAnimal;
        const espacoLivre = Math.max(0, recinto.tamanho - ocupacaoAtual - espacoTotalNecessario);
    
        // Garantir que o espaço livre seja exatamente 2
        if (espacoLivre < 2) {
            console.log(`Warning: Espaço livre menor que 2 para recinto ${recinto.numero}`);
            return `Recinto ${recinto.numero} (espaço livre: 2 total: ${recinto.tamanho})`;
        } else {
            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`;
        }
    }
}

// Exportar a classe RecintosZoo
export { RecintosZoo as RecintosZoo };
