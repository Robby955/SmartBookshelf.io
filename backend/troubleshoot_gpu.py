import torch
import platform
import subprocess
import sys

def check_cuda_version():
    try:
        cuda_version = torch.version.cuda
        print(f"CUDA version detected by PyTorch: {cuda_version}")
    except Exception as e:
        print(f"Error detecting CUDA version: {e}")

def check_cudnn_version():
    try:
        cudnn_version = torch.backends.cudnn.version()
        print(f"cuDNN version detected by PyTorch: {cudnn_version}")
    except Exception as e:
        print(f"Error detecting cuDNN version: {e}")

def check_gpu_availability():
    try:
        gpu_available = torch.cuda.is_available()
        print(f"Is GPU available: {gpu_available}")
        if gpu_available:
            gpu_name = torch.cuda.get_device_name(0)
            print(f"GPU name: {gpu_name}")
            gpu_memory = torch.cuda.get_device_properties(0).total_memory
            print(f"GPU memory: {gpu_memory / (1024 ** 3):.2f} GB")
    except Exception as e:
        print(f"Error checking GPU availability: {e}")

def check_python_version():
    python_version = platform.python_version()
    print(f"Python version: {python_version}")
    return python_version

def check_pytorch_version():
    try:
        pytorch_version = torch.__version__
        print(f"PyTorch version: {pytorch_version}")
    except Exception as e:
        print(f"Error detecting PyTorch version: {e}")

def install_compatible_pytorch():
    python_version = check_python_version()
    if python_version.startswith("3.11"):
        print("Python 3.11 detected. Attempting to install PyTorch for Python 3.11.")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
            subprocess.check_call([sys.executable, "-m", "pip", "install", "torch==2.0.1+cu117", "torchvision==0.15.2+cu117", "torchaudio==2.0.2+cu117", "--index-url", "https://download.pytorch.org/whl/cu117"])
        except Exception as e:
            print(f"Error installing PyTorch: {e}")
    else:
        print("Non-Python 3.11 environment detected. Skipping PyTorch installation.")

def main():
    print("Starting GPU Troubleshooting Script")
    check_python_version()
    check_pytorch_version()
    check_cuda_version()
    check_cudnn_version()
    check_gpu_availability()
    install_compatible_pytorch()
    check_pytorch_version()
    check_gpu_availability()

if __name__ == "__main__":
    main()
