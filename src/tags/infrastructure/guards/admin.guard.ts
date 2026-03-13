import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as { isAdmin?: boolean } | undefined;

    if (user?.isAdmin) {
      return true;
    }

    // Simple fallback for now: allow using header-based admin flag
    const isAdminHeader = request.headers['x-admin'];
    if (typeof isAdminHeader === 'string' && isAdminHeader.toLowerCase() === 'true') {
      return true;
    }

    throw new ForbiddenException('Admin privileges required');
  }
}

