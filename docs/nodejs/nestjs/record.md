## 准备工作

### 常用命令

生成新模块 `nest g resource module_name`

### 初始化 swagger 文档

```bash
pnpm i @nestjs/swagger

```

```typescript
// src/main.js
// 初始化swagger文档
const swaggerDocument = SwaggerModule.createDocument(
  app,
  new DocumentBuilder()
    .setTitle("API Document")
    .setDescription("erhang server descriptions")
    .setVersion("1.0")
    .addBearerAuth()
    .build(),
);
SwaggerModule.setup("/swagger", app, swaggerDocument);
```

### 初始化 CROS 配置跨域

```ts
// src/main.js
app.enableCors({
  origin: [
    /^http:\/\/localhost(:\d+)?$/,
    /^https?:\/\/www\.domain\.com(:80)?$/,
  ],
});
```

### 初始化全局配置

`pnpm i @nestjs/config`

```ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DogsController } from "@modules/dogs/dogs.controller";
import { CatsController } from "@modules/cats/cats.controller";
import { BirdsModule } from "@modules/birds/birds.module";
import { ConfigModule } from "@nestjs/config"; // 新增

const envConfig = {
  dev: ".env.dev",
  prod: ".env.prod",
}; // 新增

// 应用程序的根模块。
@Module({
  imports: [
    BirdsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envConfig[process.env.NODE_ENV] || ".env",
      load: [DefaultConfig, BaseConfig],
      cache: false,
    }), // 新增
  ],
  controllers: [AppController, DogsController, CatsController],
  providers: [AppService],
})
export class AppModule {}
```

```ts
// src/common/config/index.ts
import { registerAs } from "@nestjs/config";

export const DefaultConfig = () => ({
  jwtSecret: "1Q2e3W4!4%!!@*^sq123s",
  jwtRefreshSecret: "qwe@s#F43K*&sqw4@^2^21q",

  serverPort: process.env.PORT || 3000,
});

export const BaseConfig = registerAs("BaseConfig", () => ({
  dbConfig: {
    host: process.env.DATABASE_HOST || `127.0.0.1`,
    port: process.env.DATABASE_PORT || 3306,
    username: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "123456",
  },
}));
```

### 初始化限流配置

`pnpm i @nestjs/throttler`

配置全局的限流策略

```ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DogsController } from "@modules/dogs/dogs.controller";
import { CatsController } from "@modules/cats/cats.controller";
import { BirdsModule } from "@modules/birds/birds.module";
import { ConfigModule } from "@nestjs/config";
import { BaseConfig, DefaultConfig } from "~common/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"; // 新增
import { APP_GUARD } from "@nestjs/core"; // 新增

const envConfig = {
  dev: ".env.dev",
  prod: ".env.prod",
};

// 应用程序的根模块。
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envConfig[process.env.NODE_ENV] || ".env",
      load: [DefaultConfig, BaseConfig],
      cache: false,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, // 表示每个请求的时间窗口（以秒为单位）
          limit: 10, // 表示在该时间窗口内允许的最大请求次数
        },
      ],
    }), // 新增
    BirdsModule,
  ],
  controllers: [AppController, DogsController, CatsController],
  providers: [
    AppService,
    // Nest 会自动将 AuthGuard 绑定到全局所有接口上。 注意是所有 🔊
    // 如果你只想将守卫绑定到特定的模块或路由上，而不是全局生效，你应该在该模块内使用 useGuards 方法来应用守卫，而不是在提供者配置中使用 APP_GUARD。
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }, // 新增
  ],
})
export class AppModule {}
```

### 初始化定时任务调度

`pnpm install --save @nestjs/schedule`

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [ScheduleModule.forRoot()],
})
export class AppModule {}
```

声明定时任务

```ts
// src/core/cron-job/cron-job.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression, Interval } from "@nestjs/schedule";

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);

  private static readonly EVERY_MONDAY_AT_2AM = "0 2 * * 1";
  @Cron(CronJobService.EVERY_MONDAY_AT_2AM)
  async resetRankListWeekly() {
    this.logger.debug("每周一两点执行一次。");
  }

  // 要声明一个以一定间隔运行的方法，使用@Interval()装饰器前缀
  @Interval(60000 * 5)
  handleInterval() {
    this.logger.debug("每间隔 5 m 执行");
  }

  @Cron("*/6 * * * * *", {
    name: "sixCron",
    timeZone: "Europe/Paris",
  })
  triggerNotifications() {
    this.logger.debug("six cron 每6s执行一次～");
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    this.logger.debug("Called every 30 seconds");
  }
}
```

### 初始化数据库连接

`pnpm install --save @nestjs/typeorm typeorm mysql2`

```ts
// pnpm install --save @nestjs/typeorm typeorm mysql2

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
   		host: process.env.DATABASE_HOST || `127.0.0.1`,
      port: Number(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '123456',
      database: process.env.DATABASE_NAME || 'management',
      // entities: [],
      synchronize: true, //是否自动同步实体文件,生产环境建议关闭
      logging: true,
      extra: {
        connectionLimit: 3,
      },
      autoLoadEntities: true,
      timezone: '+08:00',
    }),
  ],
})
```

```ts
// src/core/core.module.ts

import { Module } from "@nestjs/common";
import { CronJobModule } from "@core/cron-job/cron-job.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CronJobModule,
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return config.get("BaseConfig")["dbConfig"];
      },
      inject: [ConfigService],
    }),
  ],
})
export class CoreModule {}
```

#### 测试数据库连接

`nest g resource user`

生成 user 模块

##### User controller

```ts
// src/modules/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
```

##### User module

```ts
// src/modules/user/user.module.ts
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserSubscriber } from "./user.subscriber";

@Module({
  // 要开始使用 User 实体，我们需要通过将其插入模块 forRoot() 方法选项中的实体数组来让 TypeORM 使用它
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserSubscriber],
  controllers: [UserController],
})
export class UserModule {}
```

##### User service

```ts
// src/modules/user/user.service.ts
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string | User> {
    const { username, password, email, phone } = createUserDto;
    const existUser = await this.usersRepository.findOne({
      where: { username: username },
    });

    if (existUser) {
      return "存在用户了";
    }

    const newUser = this.usersRepository.create({
      username,
      password: password,
      email,
      phone,
    });

    await this.usersRepository.save(newUser);
    return newUser;
  }

  /**
   * 事务的使用
   * @param users
   */
  async createMany(users: User[]) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(users[0]);
      await queryRunner.manager.save(users[1]);

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  findAll(): Promise<User[]> {
    // return `This action returns all user`;
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    // return `This action returns a #${id} user`;
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;

    const res = await this.findOne(id);
    console.log(res);
    res.password = password;
    if (res) {
      await this.usersRepository.save(res);
      return res;
    } else {
      return "用户不存在";
    }
  }

  async remove(id: number): Promise<void> {
    // return `This action removes a #${id} user`;
    await this.usersRepository.delete(id);
  }
}
```

##### User Entity

```ts
// src/modules/user/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { CustomerEntity } from "../../../common/entities/customer.entity";

/**
 * user 实体
 */
@Entity()
export class User extends CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string; // 用户名

  @Column({ length: 25 })
  email: string; // 邮箱

  @Column({ length: 25 })
  phone: string; // 电话

  @Column()
  password: string; // 密码

  @Column({ default: true })
  isActive: boolean;
}
```

##### User dto

```ts
//src/modules/user/dto/create-user.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    example: "erhang",
    description: "The username of the user",
  })
  username: string; // 用户名

  @ApiProperty({
    example: "john.doe@example.com",
    description: "The email of the user",
  })
  email: string; // 邮箱

  @ApiProperty({
    example: "15512349876",
    description: "The phone of the user",
  })
  phone: string; // 电话

  @ApiProperty({
    example: "123456",
    description: "The password of the user",
  })
  password: string; // 密码
}

// src/modules/user/dto/update-user.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: "1234567",
    description: "The new password of the user",
  })
  password: string; // 密码
}
```

#### 测试表关联

```ts
import { Role } from "@modules/roles/entities/role.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { CustomerEntity } from "~common/entities/customer.entity";

/**
 * user 实体
 */
@Entity()
export class User extends CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string; // 用户名

  @Column({ length: 25 })
  email: string; // 邮箱

  @Column({ length: 25 })
  phone: string; // 电话

  @Column()
  password: string; // 密码

  @Column({ default: true })
  isActive: boolean;

  // 新增
  @ManyToMany(() => Role)
  @JoinTable({
    name: "user_role_relation",
  })
  roles: Role[];
}

// src/modules/user/user.module.ts
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserSubscriber } from "./user.subscriber";
import { Role } from "@modules/roles/entities/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])], // 新增 Role
  providers: [UserService, UserSubscriber],
  controllers: [UserController],
})
export class UserModule {}
```

### 初始化异常过滤器

```ts
// src/common/enums/api-error-code.enum.ts
export enum ApiErrorCode {
  SUCCESS = 200, // 成功
  USER_ID_INVALID = 10001, // 用户id无效
  USER_NOT_EXIST = 10002, // 用户不存在
  USER_EXIST = 10003, //用户已存在
  PERMISSION_EXIST = 10004, //权限已存在
  ROLE_EXIST = 10005, //角色已存在
  PASSWORD_ERROR = 20005, //密码错误
  FORBIDDEN = 400, //验证不通过
  LOGIN_EXPIRE = 401, //登录状态已过期
  Forbidden = 403, //权限不足
  DATABASE_ERROR = 30001, //数据库错误
}

// src/common/filters/exception-list.ts
import { HttpException, HttpStatus } from "@nestjs/common";
import { ApiErrorCode } from "../enums/api-error-code.enum";

export class ForbiddenException extends HttpException {
  constructor() {
    super("Forbidden", HttpStatus.FORBIDDEN);
  }
}

export class ApiException extends HttpException {
  private errorMessage: string;
  private errorCode: ApiErrorCode;

  constructor(
    errorMessage: string,
    errorCode: ApiErrorCode,
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    super(errorMessage, statusCode);
    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
  }

  getErrorCode(): ApiErrorCode {
    return this.errorCode;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}

// src/common/filters/http-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ApiException } from "./exception-list";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (exception instanceof ApiException) {
      response.status(status).json({
        code: exception.getErrorCode(),
        timestamp: new Date().toISOString(),
        path: request.url,
        describe: exception.getErrorMessage(),
      });
      return;
    }

    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      url: request.url,
      describe: (exception as any)?.response?.message || exception.message,
    });
  }
}
```

#### 注册异常过滤器

```ts
// main.ts
import { HttpExceptionFilter } from "~common/filters/http-exception.filter";

// ...

// 设置全局异常拦截 该 useGlobalFilters() 方法不会为网关和混合应用程序设置过滤器。
app.useGlobalFilters(new HttpExceptionFilter());

// ...
```

### 初始化全局 Logger 中间件

中间件是在路由处理程序之前调用的函数。

中间件函数可以访问请求 `request` 和响应对象 `response`，以及在应用程序的**`请求-响应`**周期中 next() 中间件函数。

```ts
//src/common/middlewares/logger.middleware.ts

import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { blue, italic, red, yellow } from "~common/utils";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void) {
    console.log(
      italic(red("⏰ Logger middle wares was running.....")),
      yellow("请求方法：" + req.method),
      blue("请求路径：" + req.url),
    );
    next();
  }
}
```

### 初始化全局拦截器

```ts
// src/common/interceptors/transform.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Response } from "express";
import { Observable, map } from "rxjs";

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  // 构造函数是在模块加载时调用的，而不是在运行时每次请求时调用的。因此，你无法在构造函数中获取到请求特定的信息，例如 customMsg。
  // constructor(private readonly customMsg?: string) {
  //   console.log(this.customMsg);
  // }

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return {
          code: 200,
          data,
          msg: "请求成功！",
        };
      }),
    );
  }
}
// src/common/interceptors/logging.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import * as colors from "picocolors";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(colors.bgCyan("LoggingInterceptor Before...."));
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            colors.bgCyan(`LoggingInterceptor After... ${Date.now() - now}ms`),
          ),
        ),
      );
  }
}
```

### 使用拦截器、中间件

```ts
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CronJobModule } from "@core/cron-job/cron-job.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "~common/interceptors/logging.interceptor";
import { TransformInterceptor } from "~common/interceptors/transform.interceptor";
import { LoggerMiddleware } from "~common/middlewares/logger.middleware";

@Module({
  imports: [
    CronJobModule,
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return config.get("BaseConfig")["dbConfig"];
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 全局应用中间件
    consumer.apply(LoggerMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    });
  }
  constructor(private dataSource: DataSource) {}
}
```

### 初始化自定义装饰器

```ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    return data ? user?.[data] : user;
  },
);
```

#### 使用自定义装饰器

```ts
@Get()
async findOne(@User() user: UserEntity) {
  console.log(user);
}

```

Tips: 通常情况下，在发送这个请求进行测试时。不需要额外的传递 user 信息，因为装饰器直接从`req.user`中取参数。 这个`user`通常是在进行 `Authentication`认证的情况下，用户登陆后挂载在`request['user']`上的。

### 初始化全局身份认证

初始化 `JwtAuthGuard`

```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
```

在任意 module 中全局注册 `JwtAuthGuard`

```ts
providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
],
```

Nest 会自动将 JwtAuthGuard 绑定到所有接口。

声明公共路由

```ts
import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

```typescript
@Public()
@Get()
findAll() {
  return [];
}
```

修改 `JwtAuthGuard`

```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]); // 新增
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
```

### 使用 passport

#### 名词解释

1. **Passport 模块**：Passport 是一个 Node.js 的身份验证中间件，用于处理身份认证。在 NestJS 中，Passport 通常与 `@nestjs/passport` 模块一起使用，用于实现各种身份认证策略。
2. **JWT 身份认证**：JWT（JSON Web Token）是一种常用的身份认证和授权机制，在网络应用中广泛使用。通过 JWT，用户可以在不同的请求之间传递身份信息，而无需在服务器端存储会话状态。
3. **委托责任**：在这句话中，“委托”意味着将某个责任或任务交给另一个实体来处理。在这种情况下，Passport 模块将确保 JWT 没有过期的责任委托给了其他实体或模块。
4. **确保 JWT 没有过期**：JWT 通常会包含一个有效期（expiration time）字段，用于指示令牌的有效期限。Passport 模块在处理 JWT 身份认证时，会检查 JWT 的有效期字段，并确保令牌没有过期。如果 JWT 已过期，则认证失败。
5. **对称密钥**： 对称密钥是一种简单而方便的方式，用于对 JWT 进行签名和验证。在对称加密中，同一个密钥同时用于加密和解密数据。

对于您选择的任何 Passport 策略，您始终需要 @nestjs/passport 和 Passport 包。

```bash
$ pnpm install --save @nestjs/passport passport passport-local
$ pnpm install --save-dev @types/passport-local
```

在 `AuthService` 中的主要任务是检索用户并且校验密码

创建 `validateUser()` 方法用于检索用户和校验密码

```ts
import { Injectable, Dependencies } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
@Dependencies(UsersService)
export class AuthService {
  constructor(usersService) {
    this.usersService = usersService;
  }

  async validateUser(username, pass) {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
```

#### 实现 passport local 认证策略

**local authentication strategy** 本地认证策略

```ts
// local.strategy.ts
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

我们可以在调用 super() 时传递一个选项对象来自定义护照策略的行为。在此示例中，默认情况下，passport-local 策略需要 `request body` 中包含名为“username”和“password”的属性。可以传递一个 options 对象来指定不同的属性名称，例如： super({ usernameField: 'email' })

我们还实现了 validate() 方法。对于每个策略，Passport 都会使用一组适当的特定于策略的参数来调用 `validate` 函数。`@nestjs/passport`对于本地策略，Passport 需要`validate()`具有以下签名的方法：`validate(username: string, password:string): any`。

任何 `Passport` 策略的 `validate()` 方法都将遵循类似的模式，只是表示凭证的细节方面有所不同。如果找到了用户并且凭据有效，则返回该用户，以便 `Passport` 能够完成其任务(例如，在请求对象上创建`user` 属性)，并且请求处理管道可以继续。如果没有找到，我们抛出一个异常，让异常层处理它。

通常，每个策略的方法的唯一显著差异是**如何**确定用户是否存在且有效。例如，在 `JWT` 策略中，根据需求，我们可以评估解码令牌中携带的 `userId` 是否与用户数据库中的记录匹配，或者是否与已撤销的令牌列表匹配。因此，这种子类化和实现特定于策略验证的模式是一致的、优雅的和可扩展的。

#### 使用 passport local 认证策略

```ts
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
```

#### 内置 passport 守卫

**Guards** 守卫的主要功能：确定请求是否由路由处理程序。

在使用 `@nestjs/passport` 模块的情况下，还将引入一个新的小问题。从身份认证的角度来看，应用程序可以存在两种状态：

1. **未** 登陆 未通过身份认证 not logged
   - 限制未经身份验证的用户可以访问的路由（就是不让没经过身份验证的用户访问加了限制的路由）。可以通过在路由上放置一个 Guard 来处理，通过 Guard 来检测是否存在有效的 `JWT` ， 成功发出 JWT 后可以处理个 Guard。
   - 当先前未经身份验证的用户尝试登录时启动身份验证步骤。这是我们向**有效用户**发出 JWT 的步骤，考虑一下这个问题，我们知道需要 `POST` 用户名/密码凭证来启动身份验证，所以我们将设置 `POST` `/auth/login` 路径来处理这个问题。这就提出了一个问题:在这条路由上，我们究竟如何实施 `Passport-local` 策略？
     - 答案是**使用另一种稍微不同类型的守卫**。`@nestjs/passport` 模块为我们提供了一个内置的守卫，可以完成这一任务。该 Guard 调用 Passport 策略并启动上述步骤(检索凭证、运行`verify` 函数、创建用户属性等)。
2. **已** 登陆 通过身份认证 is logged

#### 使用 jwt 功能

```bash
$ pnpm install --save @nestjs/jwt passport-jwt
$ pnpm install --save-dev @types/passport-jwt
$ pnpm install --save-dev @types/passport @types/passport-jwt
```

`@nest/jwt` 包是一个实用程序包，可以帮助 `jwt` 操作。`passport-jwt` 包是实现 `JWT` 策略的 `Passport`包，`@types/passport-jwt` 提供 `TypeScript` 类型定义。

##### @nestjs/jwt 基本使用

在 `AuthModule` 中引入 `JwtModule` 并配置过期时间

```ts
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "@modules/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get("jwtSecret"),
          signOptions: { expiresIn: "7d" },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
```

##### 使用 `jwtService` 服务生成 token

```ts
// import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from "@modules/user/dto/login-user.dto";
import { UserService } from "@modules/user/user.service";
import { Token } from "./dto/update-auth.dto";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "@modules/user/dto/create-user.dto";
import { User } from "@modules/user/entities/user.entity";

export type userId = number | string;
export type generateTokenPayload = {
  userId: userId;
  username: string;
};
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginUserDto) {
    const user = await this.usersService.findByUsername(dto);

    if (!user) {
      throw new HttpException("用户不存在", HttpStatus.NOT_FOUND);
    }

    const passwordValid = await this.usersService.verifyUserPassword(dto, user);

    if (!passwordValid) {
      throw new BadRequestException("Invalid password");
    }

    return this.generateTokens({
      userId: user.id,
      username: user.username,
    });
  }

  async signUp(dto: CreateUserDto) {
    const user = await this.usersService.findByUsername(dto);

    if (user) {
      throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
    }
    const res: User = await this.usersService.create(dto);
    const payload = { userId: res.id, username: res.username };
    const { accessToken, refreshToken } = this.generateTokens(payload);

    return {
      userId: res.id,
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      accessToken,
      refreshToken,
    };
  }

  private generateTokens(payload: generateTokenPayload): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateRefreshToken(payload: generateTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get("jwtRefreshSecret"),
      expiresIn: "7d", // Set greater than the expiresIn of the access_token
    });
  }

  private generateAccessToken(payload: generateTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get("jwtSecret"),
      expiresIn: "1d", // Set greater than the expiresIn of the access_token
    });
  }
}
```

##### 全局 `AuthGuard` 自定义守卫

```ts
import { generateTokenPayload } from "@core/auth/auth.service";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { DefaultConfig } from "~common/config";
import { IS_PUBLIC_KEY } from "~common/decorators/public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    console.log("global auth guard is executed.");

    try {
      const payload: generateTokenPayload = await this.jwtService.verifyAsync(
        token,
        {
          secret: DefaultConfig().jwtSecret,
        },
      );

      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
```

#### [实现 Passport JWT](https://docs.nestjs.com/recipes/passport#implementing-passport-jwt)

实现终极目标，通过要求请求中携带有效的 JWT 来保护接口。 Passport 提供了 Passport-jwt 策略，用于使用 JSON Web 令牌保护 RESTful 端点。

创建 jwt.strategy.ts 文件

这个策略需要一些初始化配置，可以通过在 super 中传递参数实现配置。

- `jwtFromRequest` ： 提供从 Request 中提取 JWT 的方法。 在 API 请求的 Authorization header 请求头中添加 bearer token。
- ignoreExpiration： 默认为 false，当使用 Passport 模块处理 JWT 身份认证时，Passport 会负责检查 JWT 的有效期，以确保令牌没有过期。这做可以帮助确保用户提供的 JWT 仍然有效，并且可以被用来成功地进行身份认证。 如果我们的路由提供了一个过期的 `JWT` ，请求将被拒绝，并发送 `401 Unauthorized` 的响应。`Passport` 会自动为我们处理这些逻辑。
- secretOrKey： 使用对称密钥来对 JWT 进行签名。 生产环境中可能更适合的其他选项，例如使用 PEM 编码的公钥进行签名。与对称密钥不同，使用公钥/私钥对进行签名（非对称加密）在安全性上更具优势。公钥用于验证签名，而私钥用于生成签名。这种方式更安全，因为私钥不会暴露给外部。
  - 无论使用对称密钥还是公钥/私钥对，都不应该将签名密钥暴露给外部。
  - 签名密钥的安全性至关重要，因为任何人都可以使用它来生成有效的 JWT。如果签名密钥暴露，攻击者可能会伪造 JWT 并访问应用程序中的受保护资源。

`validate` 方法在 JWT 策略中很重要。

- 首先， Passport 会首先验证 JWT 的签名， 并解码其中的 json 信息作为其唯一参数传递给该方法。这个过程是验证 JWT 的有效性和提取其中的用户信息的关键步骤。
- 接着，Passport 调用我们自定义的 `validate()` 方法，并将解码后的 JSON 数据作为其唯一参数传递给该方法。这意味着我们在 `validate()` 方法中可以访问和操作从 JWT 中提取出的用户信息。
- 最后，基于 JWT 签名的工作方式，我们可以确信我们收到的是一个有效的令牌，而且这个令牌曾经是我们之前签发给一个合法用户的。这是因为 JWT 签名是使用私钥进行的，而验证是使用相应的公钥进行的。只有使用正确的私钥才能成功地签名 JWT，而只有使用相应的公钥才能成功地验证 JWT。因此，当我们在 `validate()` 方法中接收到解码后的 JSON 数据时，我们可以放心地信任这个令牌是有效的，并且是之前签发给一个合法用户的。

```ts
import { UserService } from "@modules/user/user.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { generateTokenPayload } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 提供从请求中提取 JWT 的方法。我们将使用在 API 请求的授权头中提供token的标准方法。
      ignoreExpiration: false,
      secretOrKey: configService.get("jwtSecret"),
    });
  }

  async validate(payload: generateTokenPayload) {
    const user = await this.userService.findByUserId(payload.userId as number);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

##### 使用

在 `AuthModule` 中添加新的 `JwtStrategy` 作为 Providers

```js
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('jwtSecret'),
          signOptions: { expiresIn: '7d' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // 新增
})
export class AuthModule {}
```

##### 接口上添加守卫

```ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "~common/decorators/public.decorator";
import { LoginUserDto } from "@modules/user/dto/login-user.dto";
import { CreateUserDto } from "@modules/user/dto/create-user.dto";
import { User } from "~common/decorators/user.decorator";
import {
  CustomerAuthGuard,
  JwtAuthGuard,
  LocalAuthGuard,
  // LocalAuthGuard,
} from "~common/guards/auth.guard";

@Controller("auth")
@ApiTags("Authentication 认证")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Public()
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post("signup")
  @Public()
  @HttpCode(HttpStatus.OK)
  signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Get("userInfo")
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "用于校验用户自定义 CustomerAuthGuard" })
  getUserInfo(@User() user: any) {
    return user;
  }

  /**
   * 需要引入 passport-local 策略 才能生效
   * @param dto
   * @returns
   */
  @UseGuards(LocalAuthGuard)
  @Post("localTest")
  @ApiOperation({ summary: "用于测试 passport local" })
  async loginLocal(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  /**
   * 需要引入 passport-jwt 策略 才能生效
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  @ApiBearerAuth()
  @ApiOperation({ summary: "用于测试 passport-jwt" })
  getProfile(@Request() req: any) {
    return req.user;
  }
}
```

#### 实现 `protected route` 和 ` JWT strategy guards`

受保护的路由： 需要进行身份验证才能访问的路由。实现受保护的路由通常涉及到在路由处理程序中检查用户的身份验证状态，如果用户未登录或者没有足够的权限，则重定向到登录页面或者返回相应的错误信息。

JWT 策略守卫：JWT 策略守卫是一种用于保护路由的守卫（guard），它基于 JWT 实现身份验证和授权。当用户尝试访问受保护的路由时，JWT 策略守卫会检查请求中的 JWT 是否有效，并验证其中的用户信息。如果 JWT 有效且包含了足够的授权信息，则允许用户访问路由，否则拒绝访问并返回相应的错误信息。

```ts
import { Controller, Get, Request, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { AuthService } from "./auth/auth.service";

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
```

## 一些疑问

### @nestjs/passport 和 @nestjs/jwt 有什么区别

`@nestjs/passport` 和 `@nestjs/jwt` 都是 NestJS 框架提供的模块，用于处理身份认证和授权，但它们在功能和用途上有一些区别：

1. **@nestjs/passport**：

   - `@nestjs/passport` 是 NestJS 框架中用于身份认证的模块。
   - Passport 是一个流行的 Node.js 身份验证中间件，提供了各种身份验证策略（Authentication Strategies），例如本地用户名密码、OAuth、JWT 等。
   - `@nestjs/passport` 模块封装了 Passport，使得在 NestJS 应用程序中使用 Passport 变得更加方便。
   - 通过 `@nestjs/passport`，你可以轻松地实现各种身份认证策略，并将其集成到你的 NestJS 应用中。

2. **@nestjs/jwt**：
   - `@nestjs/jwt` 是 NestJS 框架中用于处理 JSON Web Token（JWT）的模块。
   - JWT 是一种用于安全传递声明的开放标准，常用于实现无状态的身份认证和授权机制。
   - `@nestjs/jwt` 提供了用于创建和验证 JWT 的功能，以及一些与 JWT 相关的辅助函数和工具。
   - 通过 `@nestjs/jwt`，你可以在 NestJS 应用中方便地实现基于 JWT 的身份认证和授权机制。

总的来说，`@nestjs/passport` 主要用于实现各种身份认证策略，包括 JWT、OAuth 等，而 `@nestjs/jwt` 则专注于处理 JWT，提供了创建和验证 JWT 的功能。通常情况下，你可能会同时使用这两个模块，使用 `@nestjs/passport` 来定义身份认证策略，使用 `@nestjs/jwt` 来处理 JWT 的生成和验证。

### passport-local 和 passport-jwt 有啥区别

`passport-local` 和 `passport-jwt` 是 Passport.js 中两个常用的身份验证策略，它们之间的主要区别在于验证用户身份的方式以及适用的场景：

1. **passport-local**：

   - `passport-local` 是 Passport.js 提供的一种身份验证策略，用于基于用户名和密码的本地身份认证。
   - 使用 `passport-local` 策略时，用户需要提供用户名和密码来进行身份验证，通常是通过表单提交的方式进行。
   - 在认证过程中，Passport 会将用户提供的用户名和密码与数据库中存储的凭据进行比较，以确定用户的身份是否有效。
   - `passport-local` 适用于传统的用户名密码登录方式，常用于 Web 应用程序或者需要基于用户名密码进行认证的场景。

2. **passport-jwt**：
   - `passport-jwt` 是 Passport.js 提供的一种身份验证策略，用于基于 JSON Web Token（JWT）的身份认证。
   - 使用 `passport-jwt` 策略时，用户在登录成功后会收到一个 JWT，然后将这个 JWT 包含在每次请求的头部或者其他适当的位置中。
   - 在每次请求到达服务器时，Passport 会解析并验证请求中的 JWT，并检查其中的用户信息以确定用户的身份是否有效。
   - `passport-jwt` 适用于实现无状态的身份认证机制，常用于构建 RESTful API 或者需要分布式身份认证的场景。

总的来说，`passport-local` 用于基于用户名密码的本地身份认证，而 `passport-jwt` 则用于基于 JSON Web Token 的无状态身份认证。选择哪种策略取决于你的应用程序的具体需求和设计。
