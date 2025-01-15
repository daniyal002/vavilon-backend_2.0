# Указываем базовый образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Установка московского времени
ENV TZ=Europe/Moscow

RUN apt-get update && \
    apt-get install -y tzdata && \
    ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Копируем package.json и package-lock.json (если он есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта в контейнер
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Собираем приложение
RUN npm run build

# Указываем порт, который будет использоваться
EXPOSE 3002

# Команда для запуска приложения
CMD ["npm", "start"]