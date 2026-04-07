// ========== base error ==========
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ========== auth specialized error ==========
export class AuthError extends AppError {
  constructor(message: string = "Invalid email or password") {
    super(message, 400);
  }
}

// ========== ratelimit specialized error ==========
export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429);
  }
}
