FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create uploads and logs directories
RUN mkdir -p uploads/thumbnails logs

# Set permissions
RUN chmod -R 777 uploads logs

# Expose the port
EXPOSE 8080

# Start the application
CMD ["npm", "run", "dev"]