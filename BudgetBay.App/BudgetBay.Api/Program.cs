using Serilog;
using Microsoft.EntityFrameworkCore;
using BudgetBay.Data;
using BudgetBay.Repositories;
using BudgetBay.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using AutoMapper;
using CloudinaryDotNet;
using Stripe;
using CloudinaryAccount = CloudinaryDotNet.Account;
using StripeProductService = Stripe.ProductService;

namespace BudgetBay;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .WriteTo.Console()
            .CreateLogger();

        builder.Host.UseSerilog();

        builder.Services.AddControllers();
        builder.Services.AddOpenApi();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "BudgetBay API", Version = "v1" });
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter a valid token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            });
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type=ReferenceType.SecurityScheme,
                            Id="Bearer"
                        }
                    },
                    new string[]{}
                }
            });
        });


        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

        builder.Services.AddDbContext<AppDbContext>(
            options => options.UseSqlServer(connectionString)
        );

        // --- Stripe Configuration ---
        StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];
        var stripeService = new Stripe.ProductService(); // explicitly reference Stripe namespace
        builder.Services.AddSingleton(stripeService);

        // --- Cloudinary Configuration ---
        var cloudName = builder.Configuration["Cloudinary:CloudName"];
        var apiKey = builder.Configuration["Cloudinary:ApiKey"];
        var apiSecret = builder.Configuration["Cloudinary:ApiSecret"];

        var account = new CloudinaryAccount(cloudName, apiKey, apiSecret);
        var cloudinary = new Cloudinary(account);

        builder.Services.AddSingleton(cloudinary);
        
        // --- Dependency Injection Registration ---
        // Repositories
        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IAddressRepository, AddressRepository>();
        builder.Services.AddScoped<IProductRepository, ProductRepository>();
        builder.Services.AddScoped<IBidRepository, BidRepository>();


        // Services
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IProductService, BudgetBay.Services.ProductService>();
        builder.Services.AddScoped<IBidService, BidService>();
        builder.Services.AddScoped<IProfileService, ProfileService>();

        //Auto Mapper
        builder.Services.AddAutoMapper(typeof(Program));

        // --- JWT Authentication Configuration ---
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
            };
        });

        builder.Services.AddAuthorization();
        // --- Add CORS Policy ---
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin",
                builder => builder.WithOrigins("http://localhost:5173") // Your frontend URL
                                .AllowAnyHeader()
                                .AllowAnyMethod());
        });

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("AllowSpecificOrigin");
        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}