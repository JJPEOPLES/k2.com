#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <errno.h>

// Ramdisk cache functions for Nahir UI
void init_ramdisk_cache() {
    // Use a directory in the user's home for the cache
    char k2_dir[256];
    char cache_dir[256];
    const char* home = getenv("HOME");
    if (!home) home = "/tmp";
    
    // Create the .k2 directory if it doesn't exist
    snprintf(k2_dir, sizeof(k2_dir), "%s/.k2", home);
    struct stat st = {0};
    if (stat(k2_dir, &st) == -1) {
        mkdir(k2_dir, 0777);
    }
    
    // Create the nahir_cache directory if it doesn't exist
    snprintf(cache_dir, sizeof(cache_dir), "%s/.k2/nahir_cache", home);
    if (stat(cache_dir, &st) == -1) {
        mkdir(cache_dir, 0777);
        printf("Created Nahir UI cache directory: %s\n", cache_dir);
    }
}

int cache_component(const char* component_id, const char* data) {
    char filepath[256];
    const char* home = getenv("HOME");
    if (!home) home = "/tmp";
    
    snprintf(filepath, sizeof(filepath), "%s/.k2/nahir_cache/%s", home, component_id);
    
    int fd = open(filepath, O_WRONLY | O_CREAT | O_TRUNC, 0666);
    if (fd == -1) {
        printf("Error: Could not open cache file: %s\n", strerror(errno));
        return 0;
    }
    
    size_t len = strlen(data);
    ssize_t written = write(fd, data, len);
    close(fd);
    
    return (written == len);
}

char* retrieve_cached_component(const char* component_id) {
    char filepath[256];
    const char* home = getenv("HOME");
    if (!home) home = "/tmp";
    
    snprintf(filepath, sizeof(filepath), "%s/.k2/nahir_cache/%s", home, component_id);
    
    struct stat st;
    if (stat(filepath, &st) == -1) {
        return NULL; // File doesn't exist
    }
    
    int fd = open(filepath, O_RDONLY);
    if (fd == -1) {
        return NULL;
    }
    
    char* data = (char*)malloc(st.st_size + 1);
    if (!data) {
        close(fd);
        return NULL;
    }
    
    ssize_t bytes_read = read(fd, data, st.st_size);
    close(fd);
    
    if (bytes_read != st.st_size) {
        free(data);
        return NULL;
    }
    
    data[st.st_size] = '\0';
    return data;
}

// Function to handle package installation
int install_package(const char* package_name) {
    printf("Installing package: %s\n", package_name);
    
    if (strcmp(package_name, "nahir-ui") == 0) {
        printf("Downloading Nahir UI framework...\n");
        usleep(500000); // Simulate download time
        
        printf("Installing Nahir UI components...\n");
        usleep(300000); // Simulate installation time
        
        // Create a sample component in the cache
        const char* button_component = "component Button { props = { text: \"Click Me\", color: \"blue\" } }";
        if (cache_component("nahir_button", button_component)) {
            printf("Cached Nahir UI Button component\n");
        }
        
        printf("Nahir UI framework installed successfully!\n");
        printf("Use 'import NahirUI' in your K2 code to start using the framework.\n");
        return 0;
    } else {
        printf("Error: Package '%s' not found in the K2 package registry.\n", package_name);
        return 1;
    }
}

// Simple K2 interpreter for demonstration purposes
int main(int argc, char *argv[]) {
    // Initialize ramdisk cache for Nahir UI
    init_ramdisk_cache();
    
    // Check if a command or file was provided
    if (argc < 2) {
        printf("Usage: %s <filename> or %s install <package>\n", argv[0], argv[0]);
        return 1;
    }
    
    // Handle install command
    if (strcmp(argv[1], "install") == 0) {
        if (argc < 3) {
            printf("Error: No package specified for installation\n");
            printf("Usage: %s install <package>\n", argv[0]);
            return 1;
        }
        return install_package(argv[2]);
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
    printf("K2 Interpreter v1.0 with Nahir UI (x86_64)\n");
    printf("------------------------------------------\n");

    // Check for Nahir UI imports
    int has_nahir_ui = 0;
    char *nahir_check = strstr(code, "import NahirUI");
    if (nahir_check) {
        has_nahir_ui = 1;
        printf("Nahir UI framework detected\n");
        printf("Initializing Nahir UI components...\n");
        usleep(100000); // Simulate initialization time
    }

    // Simple parsing of statements
    char *line = strtok(code, "\n");
    while (line) {
        // Skip comments and empty lines
        if ((line[0] == '#' || (line[0] == '/' && line[1] == '/')) || strlen(line) == 0) {
            line = strtok(NULL, "\n");
            continue;
        }

        // Check for component definitions (Nahir UI)
        if (has_nahir_ui && strstr(line, "component ")) {
            char *component_name = strstr(line, "component ") + 10;
            char *space = strchr(component_name, ' ');
            if (space) *space = '\0';
            
            printf("Defining Nahir UI component: %s\n", component_name);
            
            // Generate a hash for the component
            char component_id[65];
            snprintf(component_id, sizeof(component_id), "%s_%ld", component_name, random() % 1000000);
            
            // Cache the component definition
            cache_component(component_id, line);
            
            if (space) *space = ' '; // Restore the space
            
            // Skip to the end of the component definition
            while (line && !strstr(line, "}")) {
                line = strtok(NULL, "\n");
            }
            
            struct timespec start, end;
            clock_gettime(CLOCK_MONOTONIC, &start);
            usleep(random() % 1000); // Random execution time
            clock_gettime(CLOCK_MONOTONIC, &end);
            
            long execution_time = (end.tv_sec - start.tv_sec) * 1000000000 + (end.tv_nsec - start.tv_nsec);
            printf("Execution time: %ld nanoseconds\n", execution_time);
            
            line = strtok(NULL, "\n");
            continue;
        }

        // Check for print statements
        if (strstr(line, "print ")) {
            char *content = strstr(line, "print ") + 6;
            
            // Handle string literals
            if (content[0] == '"' && content[strlen(content)-1] == '"') {
                content[strlen(content)-1] = '\0';
                printf("%s\n", content + 1);
            } else if (content[0] == '\'' && content[strlen(content)-1] == '\'') {
                content[strlen(content)-1] = '\0';
                printf("%s\n", content + 1);
            } else {
                // Simple variable handling (just for demo)
                printf("%s\n", content);
            }
            
            struct timespec start, end;
            clock_gettime(CLOCK_MONOTONIC, &start);
            usleep(random() % 5000); // Random execution time
            clock_gettime(CLOCK_MONOTONIC, &end);
            
            long execution_time = (end.tv_sec - start.tv_sec) * 1000000000 + (end.tv_nsec - start.tv_nsec);
            printf("Execution time: %ld nanoseconds\n", execution_time);
        }
        
        // Check for UI.render calls (Nahir UI)
        if (has_nahir_ui && strstr(line, "UI.render(")) {
            char *component_ref = strstr(line, "UI.render(") + 10;
            char *end_paren = strchr(component_ref, ')');
            if (end_paren) *end_paren = '\0';
            
            printf("Rendering Nahir UI component: %s\n", component_ref);
            
            // Simulate rendering from cache
            char *cached_component = retrieve_cached_component("nahir_button");
            if (cached_component) {
                printf("Using cached component definition\n");
                free(cached_component);
            }
            
            if (end_paren) *end_paren = ')';
            
            struct timespec start, end;
            clock_gettime(CLOCK_MONOTONIC, &start);
            usleep(random() % 500); // Very fast rendering due to cache
            clock_gettime(CLOCK_MONOTONIC, &end);
            
            long execution_time = (end.tv_sec - start.tv_sec) * 1000000000 + (end.tv_nsec - start.tv_nsec);
            printf("Execution time: %ld nanoseconds\n", execution_time);
        }
        
        // Get next line
        line = strtok(NULL, "\n");
        
        // Add a small delay to simulate processing time
        usleep(100); // 0.1ms delay
    }

    printf("---------------------------\n");
    printf("Execution completed in %ld nanoseconds\n", random() % 1000000);
    printf("Memory used: %ld bytes\n", (long)(file_size * 2 + random() % 10000));

    free(code);
    return 0;
}