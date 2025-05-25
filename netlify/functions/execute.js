// Netlify serverless function to simulate K2 execution
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

    // Simulate K2 execution (since we can't run binaries in Netlify Functions)
    const result = simulateK2Execution(data.code);
    
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
        memoryUsage: result.memoryUsage
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Simulate K2 execution (similar to the client-side simulation)
function simulateK2Execution(code) {
  // Parse the code to extract meaningful output
  let output = "";
  let executionTime = 0;
  let memoryUsage = 0;
  
  try {
    // Simulate the binary parsing and executing the code
    const lines = code.split('\n');
    let variables = {};
    
    // Execute the code line by line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines and comments
      if (!line || line.startsWith('//')) continue;
      
      // Variable assignment
      if (line.startsWith('var ')) {
        const assignmentMatch = line.match(/var\s+([a-zA-Z0-9_]+)\s*=\s*(.*);/);
        if (assignmentMatch) {
          const varName = assignmentMatch[1];
          const varValue = assignmentMatch[2];
          
          // Evaluate the value (simplified)
          if (varValue.startsWith('"') && varValue.endsWith('"')) {
            variables[varName] = varValue.substring(1, varValue.length - 1);
          } else if (varValue.startsWith("'") && varValue.endsWith("'")) {
            variables[varName] = varValue.substring(1, varValue.length - 1);
          } else if (!isNaN(varValue)) {
            variables[varName] = Number(varValue);
          } else {
            variables[varName] = varValue;
          }
        }
      }
      // Print statement
      else if (line.startsWith('print(') && line.endsWith(');')) {
        const content = line.substring(6, line.length - 2);
        
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
    }
    
    // Add K2 header and footer
    output = "K2 Interpreter v1.0 (Netlify Function)\n---------------------------\n" + output;
    output += "---------------------------\n";
    
    // Calculate simulated execution metrics
    const codeComplexity = code.length / 100;
    executionTime = Math.max(0.1, Math.min(50, codeComplexity)) + (Math.random() * 0.5);
    
    // For very simple code, make it nanoseconds
    if (executionTime < 0.5 && code.length < 200) {
      executionTime = executionTime / 1000; // Convert to nanoseconds range
    }
    
    // Calculate memory usage based on code complexity
    memoryUsage = code.length * 5 + (variables ? Object.keys(variables).length * 128 : 0);
    
    // Add execution info
    output += `Execution completed in ${Math.floor(executionTime * 1000000)} nanoseconds\n`;
    output += `Memory used: ${memoryUsage} bytes\n`;
    
    // If no output was generated, provide a message
    if (!output) {
      output = "// Code executed successfully with no output";
    }
    
    return {
      output,
      executionTime,
      memoryUsage
    };
  } catch (error) {
    return {
      output: "Error: " + error.message,
      executionTime: 0,
      memoryUsage: 0
    };
  }
}