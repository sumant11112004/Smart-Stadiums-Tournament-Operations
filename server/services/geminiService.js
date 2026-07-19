const https = require('https');

// Smart mock data generators for fallback when Gemini API key is missing or offline
const generateMockResponse = (category, query) => {
  const lowerQuery = query.toLowerCase();
  
  if (category === 'assistant') {
    if (lowerQuery.includes('gate') || lowerQuery.includes('entrance')) {
      return `Based on real-time telemetry, Gates A and D are currently experiencing low wait times (< 5 minutes). Avoid Gate B due to a temporary bottlenecks. If you are seated in the Upper Tier, Gate C is your closest gate.`;
    }
    if (lowerQuery.includes('restroom') || lowerQuery.includes('bathroom') || lowerQuery.includes('toilet')) {
      return `There are 4 high-capacity restrooms in your concourse. The nearest restroom is located behind Section 112 (wait time: 2 mins). Restrooms behind Section 118 are currently busy with a 10-minute queue.`;
    }
    if (lowerQuery.includes('food') || lowerQuery.includes('court') || lowerQuery.includes('eat') || lowerQuery.includes('drink')) {
      return `For food and beverages, the East Concourse Food Court is currently at 80% capacity. We recommend the North Deck vendor row (behind Sec 105) for local specialties, which has a 4-minute wait time. Gemini Tip: Try ordering via the app to use priority pickup lanes at Gate D.`;
    }
    if (lowerQuery.includes('parking')) {
      return `Parking Lot North (Zone A/B) is currently full. Lot South (Zone C) has 124 vacant spaces. Lot West (Zone D) is reserved for VIP/Media. We recommend parking in Lot South and using the electric shuttle to Gate A.`;
    }
    if (lowerQuery.includes('exit') || lowerQuery.includes('evacuate') || lowerQuery.includes('emergency')) {
      return `EMERGENCY EVACUATION SCHEME: In case of an emergency, proceed calmly to the nearest exit sign. Exits are located at all corner towers (Gate A, B, C, D) and concourse bridges. Follow security marshal directions. Safe assembly points are located in Parking Lot North and South.`;
    }
    if (lowerQuery.includes('wheelchair') || lowerQuery.includes('accessible') || lowerQuery.includes('disabled')) {
      return `The stadium is fully accessible. Wheelchair entrances are located at Gates A and C, featuring dedicated ramps. Accessible elevators can be found behind Sections 102, 115, and 124. Accessible restrooms are adjacent to all major restroom complexes.`;
    }
    return `Smart Stadium Assistant: Thank you for your inquiry. To assist you: 
    - Gate access: Gate A and D are clearest.
    - Food courts: Low wait times at North Deck.
    - Restrooms: Quickest queues at Section 112.
    - Transit: Metro Line 1 is operating every 3 minutes.
    Let us know if you need anything else!`;
  }

  if (category === 'companion') {
    if (lowerQuery.includes('offside')) {
      return `**FIFA Offside Rule Explanation:**
      A player is in an offside position if they are nearer to the opponent's goal line than both the ball and the second-last opponent (usually the last defender excluding the goalkeeper) at the exact moment the ball is passed to them. 
      
      *Key points:*
      1. Position is checked at the moment of the pass, not when receiving.
      2. The player must be actively involved in the play (interfering with play/an opponent, or gaining an advantage).
      3. A player cannot be offside in their own half, or directly from a throw-in, corner, or goal kick.`;
    }
    if (lowerQuery.includes('formation') || lowerQuery.includes('tactic')) {
      return `**Tactical Analysis - Popular Formations:**
      1. **4-3-3:** High press, attacking width via wingers, requires high-stamina fullbacks. Great for ball possession.
      2. **4-2-3-1:** Offers excellent defensive screen with two holding midfielders, while granting freedom to the central playmaker (#10).
      3. **3-5-2:** Excellent control of the midfield, but vulnerable in wide defensive channels if wing-backs fail to track back.`;
    }
    if (lowerQuery.includes('schedule') || lowerQuery.includes('match') || lowerQuery.includes('game')) {
      return `**FIFA World Cup 2026 Schedule Highlights:**
      - **Opening Match:** June 11, 2026, at Estadio Azteca, Mexico City.
      - **Group Stage:** June 11 - June 27, 2026.
      - **Round of 32:** June 28 - July 3, 2026.
      - **Round of 16:** July 4 - July 7, 2026.
      - **Quarterfinals:** July 9 - July 11, 2026.
      - **Semifinals:** July 14 - July 15, 2026.
      - **Final Match:** July 19, 2026, at MetLife Stadium, East Rutherford.`;
    }
    return `AI Match Companion: Exploring your match day queries!
    - Rule Check: Ask about offside, yellow card accumulation, or VAR protocols.
    - Stats: Compare teams (e.g. Argentina vs France head-to-head).
    - Details: Explain tactical terms or formations (e.g. Gegenpressing, Low Blocks).`;
  }

  if (category === 'sustainability') {
    return `**AI Sustainability Optimization Recommendations:**
    1. **Energy Management:** Dim concourse lighting by 15% during active gameplay. Schedule HVAC pre-cooling to stop 30 minutes before kick-off to utilize thermal mass.
    2. **Water Efficiency:** Enable greywater reclamation systems for pitch irrigation. Monitor low-flow flush valves in Restroom Block B, which telemetry shows are exceeding average cycles.
    3. **Waste Diversion:** Increase volunteer deployment at concession lines C3-C5 to guide fans toward compostable food container bins. Current sorting efficiency is at 74%.
    4. **Carbon Tracker:** Encourage fans to use Metro Gate exit gates by advertising a 10% discount on merchandise via stadium screens for public transport ticket holders.`;
  }

  return `Stadium operations telemetry indicates everything is functioning normally. Please specify your query.`;
};

/**
 * Calls Gemini API using standard https requests
 */
const getGeminiResponse = async (category, query) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyYourActualGeminiAPIKeyHere') {
    console.warn(`[Gemini API] API Key not set. Falling back to simulated system response.`);
    return generateMockResponse(category, query);
  }

  let promptPrefix = '';
  switch (category) {
    case 'assistant':
      promptPrefix = 'You are the FIFA World Cup 2026 Smart Stadium Assistant. Help the visitor with immediate, helpful, polite, and precise stadium navigation/operational info. Answer details on Gates, restrooms, parking, emergencies, wheelchair accessibility, lost & found, transport options. Keep answers concise, direct, and structured. Inquire context: ';
      break;
    case 'companion':
      promptPrefix = 'You are the FIFA 2026 AI Match Companion. Explain soccer rules (like offside), tactical formations, player statistics, historical match comparisons, tournament schedules, or local travel guidance. Explain clearly as a friendly, expert sports commentator. Inquire context: ';
      break;
    case 'sustainability':
      promptPrefix = 'You are the Stadium Operations Sustainability Coordinator. Provide actionable, professional, and detailed operations advice on reducing water, energy usage, food waste, carbon footprint, and trash recycling. Inquire context: ';
      break;
    default:
      promptPrefix = 'You are a FIFA 2026 Stadium Operations Assistant. Answer the query: ';
  }

  const fullPrompt = `${promptPrefix}${query}`;

  const postData = JSON.stringify({
    contents: [
      {
        parts: [
          {
            text: fullPrompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 800
    }
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 8000 // 8s timeout
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            console.error(`[Gemini API API error] Status Code: ${res.statusCode}. Body: ${body}`);
            resolve(generateMockResponse(category, query));
            return;
          }
          const parsed = JSON.parse(body);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            resolve(text);
          } else {
            console.warn('[Gemini API response parsing failed] Candidate text empty. Fallback activated.');
            resolve(generateMockResponse(category, query));
          }
        } catch (e) {
          console.error(`[Gemini API parsing exception] ${e.message}`);
          resolve(generateMockResponse(category, query));
        }
      });
    });

    req.on('error', (err) => {
      console.error(`[Gemini API Request error] ${err.message}. Fallback activated.`);
      resolve(generateMockResponse(category, query));
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn(`[Gemini API Request timeout]. Fallback activated.`);
      resolve(generateMockResponse(category, query));
    });

    req.write(postData);
    req.end();
  });
};

module.exports = {
  getGeminiResponse
};
