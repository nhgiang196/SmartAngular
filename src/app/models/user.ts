export class User
{
    Username: string;
    Password: string;
    Token: string;
    Email?: string;
    Specification?: string;
    Department? : string;
    Position? : string;
    Nickname? : string;

}

export class Login
{
    username: string;
    password: string;
    Email?: string;
    RememberMe?: boolean;
}


