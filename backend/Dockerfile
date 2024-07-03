# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Install any needed packages specified in requirements.txt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Ensure waitress is installed
RUN pip install waitress

# Copy the rest of the application code
COPY . .

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["waitress-serve", "--host=0.0.0.0", "--port=8080", "app:app"]
