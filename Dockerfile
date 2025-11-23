FROM python:3.11-slim

# Install Node.js and git
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN cd dashboard && npm install && npm run build
RUN pip3 install --no-cache-dir -r requirements.txt
RUN cd tiktok_uploader/tiktok-signature && npm install

# Create directories
RUN mkdir -p VideosDirPath ProcessedVideos CookiesDir

# Expose port
ENV PORT=3000
EXPOSE 3000

# Make start script executable
RUN chmod +x start.sh

# Start command - run Next.js in dashboard directory
CMD ["sh", "-c", "python3 youtube_monitor.py > /tmp/youtube_monitor.log 2>&1 & exec npm start --prefix /app/dashboard"]

