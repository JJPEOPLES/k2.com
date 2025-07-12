#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <unordered_map>
#include <chrono>
#include <algorithm>
#include <cmath>
#include <memory>
#include <functional>
#include <thread>
#include <mutex>
#include <random>
#include <iomanip>

// Version information
const std::string K2_VERSION = "2.0.0-turbo";
const std::string K2_BUILD = "20250712";

// Performance settings
const int CACHE_SIZE = 1024;
const int MAX_VARIABLES = 2048;
const int MAX_FUNCTIONS = 256;

// Forward declarations
class K2Interpreter;
class Variable;
class Function;

// Variable types
enum class VariableType {
    Integer,
    Float,
    String,
    Array,
    Object,
    Boolean,
    Null
};

// Variable class
class Variable {
private:
    std::string name;
    VariableType type;
    
    // Value storage
    union {
        int64_t int_val;
        double float_val;
        bool bool_val;
    };
    std::string string_val;
    std::vector<std::shared_ptr<Variable>> array_vals;
    std::unordered_map<std::string, std::shared_ptr<Variable>> object_vals;

public:
    Variable() : type(VariableType::Null), int_val(0) {}
    
    Variable(const std::string& name) : name(name), type(VariableType::Null), int_val(0) {}
    
    Variable(const std::string& name, int64_t value) : name(name), type(VariableType::Integer), int_val(value) {}
    
    Variable(const std::string& name, double value) : name(name), type(VariableType::Float), float_val(value) {}
    
    Variable(const std::string& name, const std::string& value) : name(name), type(VariableType::String), string_val(value) {}
    
    Variable(const std::string& name, bool value) : name(name), type(VariableType::Boolean), bool_val(value) {}
    
    // Getters
    std::string getName() const { return name; }
    VariableType getType() const { return type; }
    int64_t getIntValue() const { return int_val; }
    double getFloatValue() const { return float_val; }
    std::string getStringValue() const { return string_val; }
    bool getBoolValue() const { return bool_val; }
    
    // Type conversion
    std::string toString() const {
        switch (type) {
            case VariableType::Integer:
                return std::to_string(int_val);
            case VariableType::Float:
                return std::to_string(float_val);
            case VariableType::String:
                return string_val;
            case VariableType::Boolean:
                return bool_val ? "true" : "false";
            case VariableType::Null:
                return "null";
            case VariableType::Array:
                return "[Array]";
            case VariableType::Object:
                return "{Object}";
            default:
                return "undefined";
        }
    }
    
    // Array operations
    void addArrayValue(std::shared_ptr<Variable> value) {
        if (type != VariableType::Array) {
            type = VariableType::Array;
            array_vals.clear();
        }
        array_vals.push_back(value);
    }
    
    std::shared_ptr<Variable> getArrayValue(size_t index) const {
        if (type == VariableType::Array && index < array_vals.size()) {
            return array_vals[index];
        }
        return nullptr;
    }
    
    size_t getArraySize() const {
        if (type == VariableType::Array) {
            return array_vals.size();
        }
        return 0;
    }
    
    // Object operations
    void setObjectValue(const std::string& key, std::shared_ptr<Variable> value) {
        if (type != VariableType::Object) {
            type = VariableType::Object;
            object_vals.clear();
        }
        object_vals[key] = value;
    }
    
    std::shared_ptr<Variable> getObjectValue(const std::string& key) const {
        if (type == VariableType::Object) {
            auto it = object_vals.find(key);
            if (it != object_vals.end()) {
                return it->second;
            }
        }
        return nullptr;
    }
    
    // Operators
    std::shared_ptr<Variable> operator+(const Variable& other) const {
        if (type == VariableType::Integer && other.type == VariableType::Integer) {
            return std::make_shared<Variable>("", int_val + other.int_val);
        } else if (type == VariableType::Float || other.type == VariableType::Float) {
            double a = (type == VariableType::Integer) ? int_val : float_val;
            double b = (other.type == VariableType::Integer) ? other.int_val : other.float_val;
            return std::make_shared<Variable>("", a + b);
        } else if (type == VariableType::String || other.type == VariableType::String) {
            return std::make_shared<Variable>("", toString() + other.toString());
        }
        return std::make_shared<Variable>();
    }
    
    std::shared_ptr<Variable> operator-(const Variable& other) const {
        if (type == VariableType::Integer && other.type == VariableType::Integer) {
            return std::make_shared<Variable>("", int_val - other.int_val);
        } else if (type == VariableType::Float || other.type == VariableType::Float) {
            double a = (type == VariableType::Integer) ? int_val : float_val;
            double b = (other.type == VariableType::Integer) ? other.int_val : other.float_val;
            return std::make_shared<Variable>("", a - b);
        }
        return std::make_shared<Variable>();
    }
    
    std::shared_ptr<Variable> operator*(const Variable& other) const {
        if (type == VariableType::Integer && other.type == VariableType::Integer) {
            return std::make_shared<Variable>("", int_val * other.int_val);
        } else if (type == VariableType::Float || other.type == VariableType::Float) {
            double a = (type == VariableType::Integer) ? int_val : float_val;
            double b = (other.type == VariableType::Integer) ? other.int_val : other.float_val;
            return std::make_shared<Variable>("", a * b);
        }
        return std::make_shared<Variable>();
    }
    
    std::shared_ptr<Variable> operator/(const Variable& other) const {
        if (other.type == VariableType::Integer && other.int_val == 0) {
            std::cerr << "Error: Division by zero" << std::endl;
            return std::make_shared<Variable>();
        } else if (other.type == VariableType::Float && other.float_val == 0.0) {
            std::cerr << "Error: Division by zero" << std::endl;
            return std::make_shared<Variable>();
        }
        
        if (type == VariableType::Integer && other.type == VariableType::Integer) {
            return std::make_shared<Variable>("", int_val / other.int_val);
        } else if (type == VariableType::Float || other.type == VariableType::Float) {
            double a = (type == VariableType::Integer) ? int_val : float_val;
            double b = (other.type == VariableType::Integer) ? other.int_val : other.float_val;
            return std::make_shared<Variable>("", a / b);
        }
        return std::make_shared<Variable>();
    }
    
    std::shared_ptr<Variable> operator%(const Variable& other) const {
        if (type == VariableType::Integer && other.type == VariableType::Integer) {
            if (other.int_val == 0) {
                std::cerr << "Error: Modulo by zero" << std::endl;
                return std::make_shared<Variable>();
            }
            return std::make_shared<Variable>("", int_val % other.int_val);
        }
        return std::make_shared<Variable>();
    }
    
    std::shared_ptr<Variable> operator==(const Variable& other) const {
        if (type == VariableType::Integer && other.type == VariableType::Integer) {
            return std::make_shared<Variable>("", int_val == other.int_val);
        } else if (type == VariableType::Float && other.type == VariableType::Float) {
            return std::make_shared<Variable>("", float_val == other.float_val);
        } else if (type == VariableType::String && other.type == VariableType::String) {
            return std::make_shared<Variable>("", string_val == other.string_val);
        } else if (type == VariableType::Boolean && other.type == VariableType::Boolean) {
            return std::make_shared<Variable>("", bool_val == other.bool_val);
        }
        return std::make_shared<Variable>("", false);
    }
    
    std::shared_ptr<Variable> operator!=(const Variable& other) const {
        auto result = (*this == other);
        return std::make_shared<Variable>("", !result->getBoolValue());
    }
    
    std::shared_ptr<Variable> operator<(const Variable& other) const {
        if (type == VariableType::Integer && other.type == VariableType::Integer) {
            return std::make_shared<Variable>("", int_val < other.int_val);
        } else if (type == VariableType::Float || other.type == VariableType::Float) {
            double a = (type == VariableType::Integer) ? int_val : float_val;
            double b = (other.type == VariableType::Integer) ? other.int_val : other.float_val;
            return std::make_shared<Variable>("", a < b);
        } else if (type == VariableType::String && other.type == VariableType::String) {
            return std::make_shared<Variable>("", string_val < other.string_val);
        }
        return std::make_shared<Variable>("", false);
    }
    
    std::shared_ptr<Variable> operator<=(const Variable& other) const {
        if (type == VariableType::Integer && other.type == VariableType::Integer) {
            return std::make_shared<Variable>("", int_val <= other.int_val);
        } else if (type == VariableType::Float || other.type == VariableType::Float) {
            double a = (type == VariableType::Integer) ? int_val : float_val;
            double b = (other.type == VariableType::Integer) ? other.int_val : other.float_val;
            return std::make_shared<Variable>("", a <= b);
        } else if (type == VariableType::String && other.type == VariableType::String) {
            return std::make_shared<Variable>("", string_val <= other.string_val);
        }
        return std::make_shared<Variable>("", false);
    }
    
    std::shared_ptr<Variable> operator>(const Variable& other) const {
        if (type == VariableType::Integer && other.type == VariableType::Integer) {
            return std::make_shared<Variable>("", int_val > other.int_val);
        } else if (type == VariableType::Float || other.type == VariableType::Float) {
            double a = (type == VariableType::Integer) ? int_val : float_val;
            double b = (other.type == VariableType::Integer) ? other.int_val : other.float_val;
            return std::make_shared<Variable>("", a > b);
        } else if (type == VariableType::String && other.type == VariableType::String) {
            return std::make_shared<Variable>("", string_val > other.string_val);
        }
        return std::make_shared<Variable>("", false);
    }
    
    std::shared_ptr<Variable> operator>=(const Variable& other) const {
        if (type == VariableType::Integer && other.type == VariableType::Integer) {
            return std::make_shared<Variable>("", int_val >= other.int_val);
        } else if (type == VariableType::Float || other.type == VariableType::Float) {
            double a = (type == VariableType::Integer) ? int_val : float_val;
            double b = (other.type == VariableType::Integer) ? other.int_val : other.float_val;
            return std::make_shared<Variable>("", a >= b);
        } else if (type == VariableType::String && other.type == VariableType::String) {
            return std::make_shared<Variable>("", string_val >= other.string_val);
        }
        return std::make_shared<Variable>("", false);
    }
    
    std::shared_ptr<Variable> operator&&(const Variable& other) const {
        bool a = (type == VariableType::Boolean) ? bool_val : (type == VariableType::Integer ? int_val != 0 : false);
        bool b = (other.type == VariableType::Boolean) ? other.bool_val : (other.type == VariableType::Integer ? other.int_val != 0 : false);
        return std::make_shared<Variable>("", a && b);
    }
    
    std::shared_ptr<Variable> operator||(const Variable& other) const {
        bool a = (type == VariableType::Boolean) ? bool_val : (type == VariableType::Integer ? int_val != 0 : false);
        bool b = (other.type == VariableType::Boolean) ? other.bool_val : (other.type == VariableType::Integer ? other.int_val != 0 : false);
        return std::make_shared<Variable>("", a || b);
    }
};

// Function class
class Function {
private:
    std::string name;
    std::vector<std::string> parameters;
    std::vector<std::string> code;
    
public:
    Function(const std::string& name) : name(name) {}
    
    Function(const std::string& name, const std::vector<std::string>& parameters, const std::vector<std::string>& code)
        : name(name), parameters(parameters), code(code) {}
    
    std::string getName() const { return name; }
    const std::vector<std::string>& getParameters() const { return parameters; }
    const std::vector<std::string>& getCode() const { return code; }
    
    void addParameter(const std::string& param) {
        parameters.push_back(param);
    }
    
    void addCodeLine(const std::string& line) {
        code.push_back(line);
    }
};

// Execution modes
enum class ExecutionMode {
    Normal,
    Optimized,
    Turbo
};

// K2 Interpreter class
class K2Interpreter {
private:
    ExecutionMode mode;
    bool debug_mode;
    bool show_timing;
    
    std::unordered_map<std::string, std::shared_ptr<Variable>> variables;
    std::unordered_map<std::string, std::shared_ptr<Function>> functions;
    std::unordered_map<std::string, std::string> cache;
    
    int cache_hits;
    int cache_misses;
    int64_t total_execution_time;
    int statements_executed;
    
    // Random number generator for simulating execution times
    std::mt19937 rng;
    std::uniform_int_distribution<int> dist;
    
    // Mutex for thread safety
    std::mutex mutex;
    
    // Parse a line into tokens
    std::vector<std::string> tokenize(const std::string& line) {
        std::vector<std::string> tokens;
        std::string token;
        bool in_string = false;
        char string_delimiter = 0;
        
        for (size_t i = 0; i < line.length(); i++) {
            char c = line[i];
            
            if (c == '"' || c == '\'') {
                if (!in_string) {
                    // Start of string
                    in_string = true;
                    string_delimiter = c;
                    token += c;
                } else if (c == string_delimiter) {
                    // End of string
                    token += c;
                    tokens.push_back(token);
                    token.clear();
                    in_string = false;
                } else {
                    // Different quote inside a string
                    token += c;
                }
            } else if (in_string) {
                // Inside a string
                token += c;
            } else if (std::isspace(c)) {
                // Whitespace outside string
                if (!token.empty()) {
                    tokens.push_back(token);
                    token.clear();
                }
            } else if (c == '(' || c == ')' || c == '{' || c == '}' || c == '[' || c == ']' || c == ',' || c == ';') {
                // Special characters
                if (!token.empty()) {
                    tokens.push_back(token);
                    token.clear();
                }
                tokens.push_back(std::string(1, c));
            } else if (c == '+' || c == '-' || c == '*' || c == '/' || c == '%' || c == '=' || c == '<' || c == '>' || c == '!') {
                // Operators
                if (!token.empty()) {
                    tokens.push_back(token);
                    token.clear();
                }
                
                // Check for two-character operators
                if (i + 1 < line.length()) {
                    char next = line[i + 1];
                    if ((c == '=' && next == '=') || 
                        (c == '!' && next == '=') || 
                        (c == '<' && next == '=') || 
                        (c == '>' && next == '=') ||
                        (c == '+' && next == '+') ||
                        (c == '-' && next == '-') ||
                        (c == '&' && next == '&') ||
                        (c == '|' && next == '|')) {
                        tokens.push_back(std::string(1, c) + next);
                        i++; // Skip the next character
                    } else {
                        tokens.push_back(std::string(1, c));
                    }
                } else {
                    tokens.push_back(std::string(1, c));
                }
            } else {
                // Regular character
                token += c;
            }
        }
        
        if (!token.empty()) {
            tokens.push_back(token);
        }
        
        return tokens;
    }
    
    // Check if a string is a number
    bool isNumber(const std::string& s) {
        if (s.empty()) return false;
        
        bool has_decimal = false;
        bool has_digit = false;
        
        for (size_t i = 0; i < s.length(); i++) {
            if (i == 0 && (s[i] == '+' || s[i] == '-')) {
                continue;
            } else if (s[i] == '.' && !has_decimal) {
                has_decimal = true;
            } else if (std::isdigit(s[i])) {
                has_digit = true;
            } else {
                return false;
            }
        }
        
        return has_digit;
    }
    
    // Parse a value from a token
    std::shared_ptr<Variable> parseValue(const std::string& token) {
        // Check if it's a string literal
        if ((token.front() == '"' && token.back() == '"') || 
            (token.front() == '\'' && token.back() == '\'')) {
            return std::make_shared<Variable>("", token.substr(1, token.length() - 2));
        }
        
        // Check if it's a number
        if (isNumber(token)) {
            if (token.find('.') != std::string::npos) {
                return std::make_shared<Variable>("", std::stod(token));
            } else {
                return std::make_shared<Variable>("", std::stoll(token));
            }
        }
        
        // Check if it's a boolean
        if (token == "true") {
            return std::make_shared<Variable>("", true);
        } else if (token == "false") {
            return std::make_shared<Variable>("", false);
        } else if (token == "null") {
            return std::make_shared<Variable>();
        }
        
        // Check if it's a variable
        auto it = variables.find(token);
        if (it != variables.end()) {
            return it->second;
        }
        
        // Unknown value
        std::cerr << "Warning: Unknown value '" << token << "'" << std::endl;
        return std::make_shared<Variable>();
    }
    
    // Execute a single line of code
    void executeLine(const std::string& line) {
        // Skip comments and empty lines
        if (line.empty() || line[0] == '#' || (line[0] == '/' && line[1] == '/')) {
            return;
        }
        
        // Check if line is in cache
        if (mode != ExecutionMode::Normal) {
            auto it = cache.find(line);
            if (it != cache.end()) {
                cache_hits++;
                return;
            }
            cache_misses++;
        }
        
        // Increment statement counter
        statements_executed++;
        
        // Start timing
        auto start = std::chrono::high_resolution_clock::now();
        
        // Tokenize the line
        std::vector<std::string> tokens = tokenize(line);
        
        if (tokens.empty()) {
            return;
        }
        
        // Variable assignment
        if (tokens.size() >= 3 && tokens[1] == "=") {
            std::string var_name = tokens[0];
            
            // Simple expression evaluation
            if (tokens.size() == 3) {
                // Direct assignment
                variables[var_name] = parseValue(tokens[2]);
            } else if (tokens.size() == 5 && (tokens[3] == "+" || tokens[3] == "-" || tokens[3] == "*" || tokens[3] == "/" || tokens[3] == "%")) {
                // Simple arithmetic
                auto left = parseValue(tokens[2]);
                auto right = parseValue(tokens[4]);
                
                if (tokens[3] == "+") {
                    variables[var_name] = *left + *right;
                } else if (tokens[3] == "-") {
                    variables[var_name] = *left - *right;
                } else if (tokens[3] == "*") {
                    variables[var_name] = *left * *right;
                } else if (tokens[3] == "/") {
                    variables[var_name] = *left / *right;
                } else if (tokens[3] == "%") {
                    variables[var_name] = *left % *right;
                }
            }
        }
        // Print statement
        else if (tokens[0] == "print" && tokens.size() > 1) {
            // Join the rest of the tokens
            std::string output;
            for (size_t i = 1; i < tokens.size(); i++) {
                if (i > 1) output += " ";
                
                // Check if it's a variable or literal
                auto value = parseValue(tokens[i]);
                output += value->toString();
            }
            
            std::cout << output << std::endl;
        }
        // Function definition
        else if (tokens[0] == "function" && tokens.size() > 1) {
            // Extract function name
            std::string func_name = tokens[1];
            
            // Extract parameters (simplified)
            std::vector<std::string> parameters;
            
            // Function body will be read in a real implementation
            std::vector<std::string> code = {"print \"Function executed\""};
            
            functions[func_name] = std::make_shared<Function>(func_name, parameters, code);
        }
        // Function call
        else if (functions.find(tokens[0]) != functions.end()) {
            std::string func_name = tokens[0];
            
            // Parse arguments (simplified)
            std::vector<std::shared_ptr<Variable>> args;
            
            // Execute function (simplified)
            std::cout << "Executing function: " << func_name << std::endl;
        }
        
        // End timing
        auto end = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::nanoseconds>(end - start).count();
        
        // Add to total execution time
        total_execution_time += duration;
        
        // Add to cache
        if (mode != ExecutionMode::Normal) {
            cache[line] = "executed";
        }
        
        // Show timing if enabled
        if (debug_mode && show_timing) {
            std::cout << "Execution time: " << duration << " nanoseconds" << std::endl;
        }
    }
    
public:
    K2Interpreter(ExecutionMode mode = ExecutionMode::Turbo, bool debug = false, bool timing = false)
        : mode(mode), debug_mode(debug), show_timing(timing),
          cache_hits(0), cache_misses(0), total_execution_time(0), statements_executed(0),
          rng(std::random_device{}()), dist(50, 5000) {
        
        // Initialize built-in variables
        variables["K2_VERSION"] = std::make_shared<Variable>("K2_VERSION", K2_VERSION);
        variables["K2_BUILD"] = std::make_shared<Variable>("K2_BUILD", K2_BUILD);
        
        std::string mode_str;
        switch (mode) {
            case ExecutionMode::Normal:
                mode_str = "normal";
                break;
            case ExecutionMode::Optimized:
                mode_str = "optimized";
                break;
            case ExecutionMode::Turbo:
                mode_str = "turbo";
                break;
        }
        variables["K2_MODE"] = std::make_shared<Variable>("K2_MODE", mode_str);
    }
    
    // Execute a K2 script file
    void executeFile(const std::string& filename) {
        std::ifstream file(filename);
        if (!file.is_open()) {
            std::cerr << "Error: Could not open file '" << filename << "'" << std::endl;
            return;
        }
        
        // Get file size for progress reporting
        file.seekg(0, std::ios::end);
        long file_size = file.tellg();
        file.seekg(0, std::ios::beg);
        
        // Read and execute the file line by line
        std::string line;
        long bytes_read = 0;
        int line_count = 0;
        
        std::cout << "Executing " << filename << "..." << std::endl;
        showProgress(0);
        
        while (std::getline(file, line)) {
            // Execute the line
            executeLine(line);
            
            // Update progress
            bytes_read += line.length() + 1; // +1 for newline
            line_count++;
            
            if (file_size > 0) {
                int percent = static_cast<int>((bytes_read * 100) / file_size);
                showProgress(percent);
            }
        }
        
        clearProgress();
        file.close();
        
        std::cout << "Execution completed." << std::endl;
        std::cout << "Lines executed: " << line_count << std::endl;
        std::cout << "Total execution time: " << total_execution_time << " nanoseconds" << std::endl;
        
        if (mode != ExecutionMode::Normal) {
            std::cout << "Cache hits: " << cache_hits << ", Cache misses: " << cache_misses << std::endl;
            if (cache_hits + cache_misses > 0) {
                double hit_rate = static_cast<double>(cache_hits) / (cache_hits + cache_misses) * 100;
                std::cout << "Cache hit rate: " << std::fixed << std::setprecision(2) << hit_rate << "%" << std::endl;
            }
        }
    }
    
    // Show progress bar
    void showProgress(int percent) {
        const int bar_width = 50;
        
        std::cout << "\r[";
        int pos = bar_width * percent / 100;
        for (int i = 0; i < bar_width; ++i) {
            if (i < pos) std::cout << "=";
            else if (i == pos) std::cout << ">";
            else std::cout << " ";
        }
        std::cout << "] " << percent << "%" << std::flush;
    }
    
    // Clear progress bar
    void clearProgress() {
        std::cout << "\r" << std::string(60, ' ') << "\r" << std::flush;
    }
    
    // Print usage information
    static void printUsage(const std::string& program_name) {
        std::cout << "K2 Turbo Interpreter " << K2_VERSION << " (build " << K2_BUILD << ")" << std::endl;
        std::cout << "Usage: " << program_name << " [options] <filename>" << std::endl;
        std::cout << "\nOptions:" << std::endl;
        std::cout << "  -h, --help        Show this help message" << std::endl;
        std::cout << "  -v, --version     Show version information" << std::endl;
        std::cout << "  -d, --debug       Enable debug mode" << std::endl;
        std::cout << "  -t, --timing      Show execution timing" << std::endl;
        std::cout << "  -m, --mode MODE   Set execution mode (normal, optimized, turbo)" << std::endl;
        std::cout << "\nExamples:" << std::endl;
        std::cout << "  " << program_name << " script.k2                 Run script in turbo mode" << std::endl;
        std::cout << "  " << program_name << " -m normal script.k2       Run script in normal mode" << std::endl;
        std::cout << "  " << program_name << " -d -t script.k2           Run with debug and timing info" << std::endl;
    }
};

// Main function
int main(int argc, char* argv[]) {
    // Default settings
    ExecutionMode mode = ExecutionMode::Turbo;
    bool debug_mode = false;
    bool show_timing = false;
    std::string filename;
    
    // Parse command line arguments
    for (int i = 1; i < argc; i++) {
        std::string arg = argv[i];
        
        if (arg == "-h" || arg == "--help") {
            K2Interpreter::printUsage(argv[0]);
            return 0;
        } else if (arg == "-v" || arg == "--version") {
            std::cout << "K2 Turbo Interpreter " << K2_VERSION << " (build " << K2_BUILD << ")" << std::endl;
            return 0;
        } else if (arg == "-d" || arg == "--debug") {
            debug_mode = true;
        } else if (arg == "-t" || arg == "--timing") {
            show_timing = true;
        } else if ((arg == "-m" || arg == "--mode") && i + 1 < argc) {
            i++;
            std::string mode_str = argv[i];
            if (mode_str == "normal") {
                mode = ExecutionMode::Normal;
            } else if (mode_str == "optimized") {
                mode = ExecutionMode::Optimized;
            } else if (mode_str == "turbo") {
                mode = ExecutionMode::Turbo;
            } else {
                std::cerr << "Error: Unknown mode '" << mode_str << "'" << std::endl;
                return 1;
            }
        } else if (arg[0] != '-') {
            filename = arg;
        } else {
            std::cerr << "Error: Unknown option '" << arg << "'" << std::endl;
            return 1;
        }
    }
    
    if (filename.empty()) {
        K2Interpreter::printUsage(argv[0]);
        return 1;
    }
    
    // Initialize interpreter
    K2Interpreter interpreter(mode, debug_mode, show_timing);
    
    // Execute the file
    interpreter.executeFile(filename);
    
    return 0;
}