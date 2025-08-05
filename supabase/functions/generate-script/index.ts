import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { episodeData } = await req.json()
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `
Você é um roteirista especializado em conteúdo educacional. Crie um roteiro completo e detalhado baseado nas informações fornecidas abaixo.

DADOS DO EPISÓDIO:
- Título: ${episodeData.title}
- Descrição: ${episodeData.description}
- Tema Central: ${episodeData.theme}
- Objetivos de Aprendizagem: ${episodeData.objectives.join(', ')}
- Personagens: ${episodeData.characters.map(c => `${c.name} (${c.role}): ${c.description}`).join('; ')}
- Conflito: ${episodeData.conflict}
- Resultado de Aprendizagem: ${episodeData.learningOutcome}
- Gancho/Cliffhanger: ${episodeData.cliffhanger}

INSTRUÇÕES:
1. Crie um roteiro estruturado seguindo o formato markdown fornecido
2. Desenvolva diálogos naturais e educativos entre os personagens
3. Descreva cenários apropriados para a narrativa
4. Inclua descrições detalhadas de cenas e animações
5. Mantenha o foco nos objetivos de aprendizagem
6. Duração estimada: até 5 minutos
7. Use os personagens fornecidos de forma coerente com suas características

Retorne o roteiro completo seguindo esta estrutura:

# Roteiro – Episódio [número]

## 1. Dados Gerais
- **Título provisório:** [título]
- **Duração estimada:** até 5 min
- **Objetivos de aprendizagem:**
[lista dos objetivos]

## 2. Personagens em Cena
[lista dos personagens com descrições]

## 3. Cenários
- **Internos:** [cenários internos apropriados]
- **Externos:** [cenários externos apropriados]

## 4. Estrutura Narrativa
1. **Abertura / Gancho:** [como inicia o episódio]
2. **Conflito / Dúvida:** [desenvolvimento do conflito]
3. **Desenvolvimento:** [como o conflito se desenrola]
4. **Síntese & Gancho próximo episódio:** [conclusão e gancho]

## 5. Diálogo
[Desenvolva diálogos completos e naturais entre os personagens, organizados por cenas]

## 6. Descrição da Cena
[Descreva detalhadamente cada cena visual]

## 7. Descrição da Animação
[Especifique enquadramentos e movimentos de câmera para cada cena]

## 8. B-roll (quando houver)
[Imagens de apoio necessárias]

Seja criativo, educativo e mantenha o conteúdo envolvente para o público-alvo.
`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'Você é um roteirista especializado em conteúdo educacional. Crie roteiros detalhados, criativos e pedagogicamente eficazes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate script')
    }

    const generatedScript = data.choices[0]?.message?.content || ''

    return new Response(
      JSON.stringify({ script: generatedScript }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})