FROM node:18

RUN apt-get update
RUN apt-get install -y openssl
RUN openssl version -v
RUN uname -a
RUN echo #DATABASE_URL

# Create app directory
WORKDIR /app

# Install prisma for the migration
RUN npm install --location=global prisma --unsafe-perm

# Copy schema and migration folder
ADD ./ ./prisma/

CMD ["prisma", "db", "push"]
