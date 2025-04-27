#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Blog-Less Application...${NC}"

if ! command -v docker &>/dev/null || ! command -v docker compose up &>/dev/null; then
	echo -e "${YELLOW}Docker and/or Docker Compose are not installed. Please install them to use this script.${NC}"
	exit 1
fi

echo -e "${GREEN}Starting Docker containers...${NC}"
docker-compose up -d

echo -e "${GREEN}Waiting for services to start...${NC}"
echo -e "${YELLOW}This may take a minute or two for the first run as Docker images are downloaded and built.${NC}"
sleep 5

echo -e "\n${GREEN}=== Blog-Less is now running! ====${NC}"
echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}Backend API:${NC} http://localhost:8080"
echo -e "\n${GREEN}Default login credentials:${NC}"
echo -e "Admin: admin@example.com / password123"
echo -e "User: john@example.com / password123"
echo -e "\n${YELLOW}To stop the application, run:${NC} docker-compose down"
echo -e "${YELLOW}To view logs, run:${NC} docker-compose logs -f"
