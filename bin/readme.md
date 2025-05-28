# K2 Binary Executables

This directory contains the precompiled K2 binaries for different platforms.

## Available Binaries

- `k2_x86_64` - Linux x86_64 binary
- `k2_x86_64.exe` - Windows x86_64 binary
- `k2_arm64` - macOS ARM64 binary (Apple Silicon)
- `k2_x86_64_mac` - macOS x86_64 binary (Intel)

## Usage

The K2 binary can be used to execute K2 code files:

```bash
./k2_x86_64 path/to/file.k2
```

For the online runner, the binary is executed by the server-side script in `/api/execute.php`.

## Building from Source

If you need to rebuild the binaries, please refer to the build instructions in the main repository README.

## Security Note

The online runner executes code in a sandboxed environment with limited resources and permissions to ensure security.