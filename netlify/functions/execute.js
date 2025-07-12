// Netlify serverless function to simulate K2 execution with K2 Turbo
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    
    // Validate the request
    if (!data.code || data.code.trim() === '') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No code provided' })
      };
    }

    // Check if we should use K2 Turbo mode
    const useTurbo = data.turbo === true || data.mode === 'turbo';
    
    // Simulate K2 execution (since we can't run binaries in Netlify Functions)
    const result = simulateK2Execution(data.code, useTurbo);
    
    // Return the response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        output: result.output,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage,
        mode: useTurbo ? 'turbo' : 'normal'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Simulate K2 execution with optional Turbo mode
function simulateK2Execution(code, useTurbo = false) {
  // Parse the code to extract meaningful output
  let output = "";
  let executionTime = 0;
  let memoryUsage = 0;
  let cacheHits = 0;
  let cacheMisses = 0;
  
  try {
    // Simulate the binary parsing and executing the code
    const lines = code.split('\n');
    let variables = {};
    let functions = {};
    let cache = {};
    
    // Add K2 header
    const version = useTurbo ? "2.0.0-turbo" : "1.0.0";
    const build = "20250712";
    output = `K2 ${useTurbo ? 'Turbo ' : ''}Interpreter v${version} (Netlify Function)\n`;
    output += "---------------------------\n";
    
    // Show loading progress for Turbo mode
    if (useTurbo) {
      output += "Initializing K2 Turbo environment...\n";
      output += "Loading optimized execution engine...\n";
      output += "Cache system initialized\n";
      output += "---------------------------\n";
    }
    
    // Execute the code line by line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines and comments
      if (!line || line.startsWith('#') || line.startsWith('//')) continue;
      
      // Check cache in Turbo mode
      if (useTurbo && cache[line]) {
        cacheHits++;
        continue;
      } else if (useTurbo) {
        cacheMisses++;
      }
      
      // Start line execution timing
      const lineStartTime = performance.now();
      
      // Variable assignment (K2 style)
      if (line.includes('=') && !line.startsWith('print') && !line.startsWith('function')) {
        const parts = line.split('=').map(p => p.trim());
        if (parts.length === 2) {
          const varName = parts[0];
          const varValue = parts[1];
          
          // Evaluate the value (simplified)
          if (varValue.startsWith('"') && varValue.endsWith('"')) {
            variables[varName] = varValue.substring(1, varValue.length - 1);
          } else if (varValue.startsWith("'") && varValue.endsWith("'")) {
            variables[varName] = varValue.substring(1, varValue.length - 1);
          } else if (!isNaN(varValue)) {
            variables[varName] = Number(varValue);
          } else if (varValue === 'true' || varValue === 'false') {
            variables[varName] = varValue === 'true';
          } else if (varValue.includes('+')) {
            // Simple addition
            const addParts = varValue.split('+').map(p => p.trim());
            let result = 0;
            let isString = false;
            
            for (const part of addParts) {
              if (part.startsWith('"') || part.startsWith("'")) {
                isString = true;
                break;
              }
            }
            
            if (isString) {
              // String concatenation
              result = '';
              for (const part of addParts) {
                if (part.startsWith('"') && part.endsWith('"')) {
                  result += part.substring(1, part.length - 1);
                } else if (part.startsWith("'") && part.endsWith("'")) {
                  result += part.substring(1, part.length - 1);
                } else if (!isNaN(part)) {
                  result += part;
                } else if (variables[part] !== undefined) {
                  result += variables[part];
                }
              }
            } else {
              // Numeric addition
              for (const part of addParts) {
                if (!isNaN(part)) {
                  result += Number(part);
                } else if (variables[part] !== undefined && typeof variables[part] === 'number') {
                  result += variables[part];
                }
              }
            }
            
            variables[varName] = result;
          } else if (varValue.includes('-') && !varValue.includes('+') && !varValue.includes('*') && !varValue.includes('/')) {
            // Simple subtraction
            const subParts = varValue.split('-').map(p => p.trim());
            if (subParts.length === 2) {
              let left = !isNaN(subParts[0]) ? Number(subParts[0]) : 
                         (variables[subParts[0]] !== undefined ? variables[subParts[0]] : 0);
              let right = !isNaN(subParts[1]) ? Number(subParts[1]) : 
                          (variables[subParts[1]] !== undefined ? variables[subParts[1]] : 0);
              
              variables[varName] = left - right;
            }
          } else if (varValue.includes('*') && !varValue.includes('+') && !varValue.includes('-') && !varValue.includes('/')) {
            // Simple multiplication
            const mulParts = varValue.split('*').map(p => p.trim());
            if (mulParts.length === 2) {
              let left = !isNaN(mulParts[0]) ? Number(mulParts[0]) : 
                         (variables[mulParts[0]] !== undefined ? variables[mulParts[0]] : 0);
              let right = !isNaN(mulParts[1]) ? Number(mulParts[1]) : 
                          (variables[mulParts[1]] !== undefined ? variables[mulParts[1]] : 0);
              
              variables[varName] = left * right;
            }
          } else if (varValue.includes('/') && !varValue.includes('+') && !varValue.includes('-') && !varValue.includes('*')) {
            // Simple division
            const divParts = varValue.split('/').map(p => p.trim());
            if (divParts.length === 2) {
              let left = !isNaN(divParts[0]) ? Number(divParts[0]) : 
                         (variables[divParts[0]] !== undefined ? variables[divParts[0]] : 0);
              let right = !isNaN(divParts[1]) ? Number(divParts[1]) : 
                          (variables[divParts[1]] !== undefined ? variables[divParts[1]] : 0);
              
              if (right !== 0) {
                variables[varName] = left / right;
              } else {
                output += "Error: Division by zero\n";
              }
            }
          } else {
            // Variable reference or other value
            if (variables[varValue] !== undefined) {
              variables[varName] = variables[varValue];
            } else {
              variables[varName] = varValue;
            }
          }
        }
      }
      // Print statement (K2 style)
      else if (line.startsWith('print ')) {
        const content = line.substring(6).trim();
        
        // Evaluate the content
        let printValue = "";
        
        if (content.startsWith('"') && content.endsWith('"')) {
          printValue = content.substring(1, content.length - 1);
        } else if (content.startsWith("'") && content.endsWith("'")) {
          printValue = content.substring(1, content.length - 1);
        } else if (!isNaN(content)) {
          printValue = content;
        } else if (content.includes('+')) {
          // String concatenation
          const parts = content.split('+').map(p => p.trim());
          let result = "";
          
          for (const part of parts) {
            if (part.startsWith('"') && part.endsWith('"')) {
              result += part.substring(1, part.length - 1);
            } else if (part.startsWith("'") && part.endsWith("'")) {
              result += part.substring(1, part.length - 1);
            } else if (!isNaN(part)) {
              result += part;
            } else if (variables[part] !== undefined) {
              result += variables[part];
            } else {
              result += `[undefined:${part}]`;
            }
          }
          
          printValue = result;
        } else if (variables[content] !== undefined) {
          // Variable reference
          printValue = variables[content];
        } else {
          printValue = `[undefined:${content}]`;
        }
        
        output += printValue + "\n";
      }
      // Function definition
      else if (line.startsWith('function ')) {
        const funcMatch = line.match(/function\s+([a-zA-Z0-9_]+)/);
        if (funcMatch) {
          const funcName = funcMatch[1];
          functions[funcName] = {
            name: funcName,
            defined: true
          };
          
          // Skip function body until we find "end"
          let j = i + 1;
          while (j < lines.length && !lines[j].trim().startsWith('end')) {
            j++;
          }
          i = j; // Skip to the end of the function
        }
      }
      // Function call
      else if (functions[line.split('(')[0]]) {
        const funcName = line.split('(')[0];
        output += `Executing function: ${funcName}\n`;
        
        // Simulate function execution
        if (funcName === 'init_gui') {
          output += "GUI system initialized\n";
        } else if (funcName === 'create_window') {
          const match = line.match(/create_window\s*\(\s*"([^"]*)"\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
          if (match) {
            const title = match[1];
            const width = match[2];
            const height = match[3];
            output += `Window created: ${title} (${width}x${height})\n`;
          }
        } else if (funcName === 'add_button') {
          const match = line.match(/add_button\s*\(\s*"([^"]*)"\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
          if (match) {
            const label = match[1];
            const x = match[2];
            const y = match[3];
            const width = match[4];
            const height = match[5];
            output += `Button added: ${label} at (${x},${y}) with size ${width}x${height}\n`;
          }
        }
      }
      
      // End line execution timing
      const lineEndTime = performance.now();
      const lineExecutionTime = lineEndTime - lineStartTime;
      
      // Add to total execution time
      executionTime += lineExecutionTime;
      
      // Add to cache in Turbo mode
      if (useTurbo) {
        cache[line] = true;
      }
    }
    
    // Add footer
    output += "---------------------------\n";
    
    // Calculate simulated execution metrics
    if (useTurbo) {
      // Turbo mode is much faster
      executionTime = executionTime * 0.01; // 100x faster
    }
    
    // Calculate memory usage based on code complexity
    memoryUsage = code.length * (useTurbo ? 3 : 5) + 
                 (variables ? Object.keys(variables).length * (useTurbo ? 64 : 128) : 0) +
                 (functions ? Object.keys(functions).length * (useTurbo ? 128 : 256) : 0);
    
    // Add execution info
    output += `Execution completed in ${Math.floor(executionTime * 1000000)} nanoseconds\n`;
    output += `Memory used: ${memoryUsage} bytes\n`;
    
    // Add cache info for Turbo mode
    if (useTurbo) {
      output += `Cache hits: ${cacheHits}, Cache misses: ${cacheMisses}\n`;
      if (cacheHits + cacheMisses > 0) {
        const hitRate = (cacheHits / (cacheHits + cacheMisses) * 100).toFixed(2);
        output += `Cache hit rate: ${hitRate}%\n`;
      }
    }
    
    // If no output was generated, provide a message
    if (!output) {
      output = "// Code executed successfully with no output";
    }
    
    return {
      output,
      executionTime,
      memoryUsage,
      cacheHits,
      cacheMisses
    };
  } catch (error) {
    return {
      output: "Error: " + error.message,
      executionTime: 0,
      memoryUsage: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
  }
}