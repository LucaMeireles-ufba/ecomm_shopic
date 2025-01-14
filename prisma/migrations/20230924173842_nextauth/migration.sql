-- CreateTable
CREATE TABLE "NextAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "refresh_token_expires_in" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "NextAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NextSession" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NextSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NextUser" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "bio" TEXT,
    "age" INTEGER,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "userId" INTEGER,

    CONSTRAINT "NextUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NextVerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "NextAccount_provider_providerAccountId_key" ON "NextAccount"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "NextSession_sessionToken_key" ON "NextSession"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "NextUser_email_key" ON "NextUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NextUser_userId_key" ON "NextUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NextVerificationToken_token_key" ON "NextVerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "NextVerificationToken_identifier_token_key" ON "NextVerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "NextAccount" ADD CONSTRAINT "NextAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "NextUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NextSession" ADD CONSTRAINT "NextSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "NextUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NextUser" ADD CONSTRAINT "NextUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
