import { Request, Response, NextFunction } from 'express';

type Rule = {
  required?: boolean;
  type?: 'string' | 'number';
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
};
type Schema = Record<string, Rule>;

/*
 * Lightweight request-body validator — no external deps.
 * Usage: router.post('/', validate(schema), handler)
 */
export function validate(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const [field, rule] of Object.entries(schema)) {
      const value = req.body?.[field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        res.status(400).json({
          message: rule.message ?? `${field} is required`,
          code: 'VALIDATION_ERROR',
          status: 400,
        });
        return;
      }
      if (value === undefined || value === null || value === '') continue;

      if (rule.type === 'number') {
        const n = Number(value);
        if (isNaN(n)) {
          res.status(400).json({ message: `${field} must be a number`, code: 'VALIDATION_ERROR', status: 400 });
          return;
        }
        if (rule.min !== undefined && n < rule.min) {
          res.status(400).json({ message: `${field} must be at least ${rule.min}`, code: 'VALIDATION_ERROR', status: 400 });
          return;
        }
        if (rule.max !== undefined && n > rule.max) {
          res.status(400).json({ message: `${field} must be at most ${rule.max}`, code: 'VALIDATION_ERROR', status: 400 });
          return;
        }
      }

      if (rule.type === 'string') {
        if (typeof value !== 'string') {
          res.status(400).json({ message: `${field} must be a string`, code: 'VALIDATION_ERROR', status: 400 });
          return;
        }
        if (rule.min !== undefined && value.trim().length < rule.min) {
          res.status(400).json({ message: `${field} must be at least ${rule.min} characters`, code: 'VALIDATION_ERROR', status: 400 });
          return;
        }
        if (rule.max !== undefined && value.trim().length > rule.max) {
          res.status(400).json({ message: `${field} must be at most ${rule.max} characters`, code: 'VALIDATION_ERROR', status: 400 });
          return;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          res.status(400).json({ message: rule.message ?? `${field} is invalid`, code: 'VALIDATION_ERROR', status: 400 });
          return;
        }
      }
    }
    next();
  };
}

// Schemas
export const createRoomSchema: Schema = {
  name:       { required: true, type: 'string', min: 1, max: 80 },
  width:      { required: true, type: 'number', min: 1, max: 50 },
  height:     { required: true, type: 'number', min: 1, max: 50 },
  shape:      { type: 'string', pattern: /^(rectangle|l-shape)$/, message: 'shape must be rectangle or l-shape' },
  wallColour: { type: 'string', pattern: /^#[0-9a-fA-F]{6}$/, message: 'wallColour must be a valid hex colour' },
};

export const updateRoomSchema: Schema = {
  name:       { type: 'string', min: 1, max: 80 },
  width:      { type: 'number', min: 1, max: 50 },
  height:     { type: 'number', min: 1, max: 50 },
  shape:      { type: 'string', pattern: /^(rectangle|l-shape)$/, message: 'shape must be rectangle or l-shape' },
  wallColour: { type: 'string', pattern: /^#[0-9a-fA-F]{6}$/, message: 'wallColour must be a valid hex colour' },
};
