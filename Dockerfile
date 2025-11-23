FROM python:3.11-slim

# Install Node.js, git, and bash
RUN apt-get update && apt-get install -y \
    curl \
    git \
    bash \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy all files
COPY . .

# Install dashboard dependencies and build
WORKDIR /app/dashboard
RUN npm install && npm run build

# Install Python dependencies
WORKDIR /app
RUN pip3 install --no-cache-dir -r requirements.txt

# Install tiktok-signature dependencies
WORKDIR /app/tiktok_uploader/tiktok-signature
RUN npm install

# Back to app root
WORKDIR /app

# Create directories
RUN mkdir -p VideosDirPath ProcessedVideos CookiesDir

# Expose port
ENV PORT=3000
EXPOSE 3000

# Copy and set entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Start command
CMD ["/entrypoint.sh"]

