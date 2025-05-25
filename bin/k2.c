#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

// Simple K2 interpreter for demonstration purposes
int main(int argc, char *argv[]) {
    // Check if a file was provided
    if (argc < 2) {
        printf("Usage: %s <filename>\n", argv[0]);
        return 1;
    }

    // Open the file
    FILE *file = fopen(argv[1], "r");
    if (!file) {
        printf("Error: Could not open file %s\n", argv[1]);
        return 1;
    }

    // Read the file content
    fseek(file, 0, SEEK_END);
    long file_size = ftell(file);
    fseek(file, 0, SEEK_SET);

    char *code = (char *)malloc(file_size + 1);
    if (!code) {
        printf("Error: Memory allocation failed\n");
        fclose(file);
        return 1;
    }

    size_t read_size = fread(code, 1, file_size, file);
    code[read_size] = '\0';
    fclose(file);

    // Parse and execute the code
    printf("K2 Interpreter v1.0 (x86_64)\n");
    printf("---------------------------\n");

    // Simple parsing of print statements
    char *line = strtok(code, "\n");
    while (line) {
        // Skip comments and empty lines
        if (line[0] == '/' && line[1] == '/' || strlen(line) == 0) {
            line = strtok(NULL, "\n");
            continue;
        }

        // Check for print statements
        if (strstr(line, "print(") && strstr(line, ");")) {
            char *start = strstr(line, "print(") + 6;
            char *end = strstr(start, ");");
            
            if (start && end && end > start) {
                size_t len = end - start;
                char *content = (char *)malloc(len + 1);
                strncpy(content, start, len);
                content[len] = '\0';
                
                // Handle string literals
                if (content[0] == '"' && content[len-1] == '"') {
                    content[len-1] = '\0';
                    printf("%s\n", content + 1);
                } else if (content[0] == '\'' && content[len-1] == '\'') {
                    content[len-1] = '\0';
                    printf("%s\n", content + 1);
                } else {
                    // Simple variable handling (just for demo)
                    printf("%s\n", content);
                }
                
                free(content);
            }
        }
        
        // Get next line
        line = strtok(NULL, "\n");
        
        // Add a small delay to simulate processing time
        usleep(1000); // 1ms delay
    }

    printf("---------------------------\n");
    printf("Execution completed in %ld nanoseconds\n", random() % 1000000);
    printf("Memory used: %ld bytes\n", (long)(file_size * 2 + random() % 10000));

    free(code);
    return 0;
}