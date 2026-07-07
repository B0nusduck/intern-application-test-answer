IF DB_ID('todoappdb') IS NULL
BEGIN
  CREATE DATABASE todoappdb;
END
GO

USE todoappdb;
GO

IF OBJECT_ID('dbo.todos', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.todos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(200) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    [dateTime] SMALLDATETIME NULL,
    completed BIT NOT NULL
  );
END
GO
