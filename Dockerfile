# Dùng Node.js 20
FROM node:20

# Tạo thư mục làm việc
WORKDIR /app

# Copy toàn bộ source trước (bao gồm .env, prisma/schema.prisma,...)
COPY . .

# Cài dependency
RUN npm install

# Chạy Prisma generate sau khi đã có .env
RUN npx prisma generate

# Mở port app
EXPOSE 3000

# Chạy app (dùng nodemon cho dev)
CMD ["npm", "run", "dev"]
