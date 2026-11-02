FROM node:24.22.1-slim
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN npm install -g pnpm@12.15.0
WORKDIR /app
COPY upstream-project/ .
RUN CI=true pnpm install --frozen-lockfile
RUN pnpm --filter @twofiat/web build
RUN CI=true pnpm install --frozen-lockfile --prod
