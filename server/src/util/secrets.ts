// TODO: Move this file to .env file
export const MONGODB_URI = "mongodb+srv://alekspavic2409:Aleks.Pavic2409@cluster0.qxsiypq.mongodb.net/?retryWrites=true&w=majority"

if (!MONGODB_URI) {
  console.log('No mongo connection string. Set MONGODB_URI environment variable.')
  process.exit(1)
}

export const JWT_SECRET = "secret"

if (!JWT_SECRET) {
  console.log('No JWT secret string. Set JWT_SECRET environment variable.')
  process.exit(1)
}