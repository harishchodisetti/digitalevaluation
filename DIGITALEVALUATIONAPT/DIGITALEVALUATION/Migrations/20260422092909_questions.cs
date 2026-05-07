using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DIGITALEVALUATION.Migrations
{
    /// <inheritdoc />
    public partial class questions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           
            migrationBuilder.CreateTable(
                name: "ExamSections",
                columns: table => new
                {
                    SectionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExamId = table.Column<int>(type: "int", nullable: false),
                    SectionName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TotalQuestions = table.Column<int>(type: "int", nullable: true),
                    AnswerRequired = table.Column<int>(type: "int", nullable: true),
                    MarksPerQuestion = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamSections", x => x.SectionId);
                    table.ForeignKey(
                        name: "FK_ExamSections_Exams_ExamId",
                        column: x => x.ExamId,
                        principalTable: "Exams",
                        principalColumn: "ExamId",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.Sql(@"
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Questions')
BEGIN
    CREATE TABLE Questions (
        QuestionId INT IDENTITY(1,1) PRIMARY KEY,

        QuestionCode NVARCHAR(50) NULL,
        QuestionText NVARCHAR(MAX) NULL,
        QuestionImagePath NVARCHAR(500) NULL,
        QuestionType NVARCHAR(50) NULL,
        DifficultyLevel NVARCHAR(20) NULL,

        CollegeId INT NULL,
        CourseId INT NULL,
        BranchId INT NULL,
        SubjectId INT NULL,

        Semester INT NULL,
        UnitNumber INT NULL,
        MaxMarks DECIMAL(5,2) NULL,

        IsOptional BIT NOT NULL,
        Tags NVARCHAR(200) NULL,

        CreatedBy NVARCHAR(MAX) NULL,
        CreatedDate DATETIME2 NOT NULL,
        UpdatedBy NVARCHAR(MAX) NULL,
        UpdatedDate DATETIME2 NULL,

        IsActive BIT NOT NULL,
        IsDeleted BIT NOT NULL
    );

    ALTER TABLE Questions
    ADD CONSTRAINT FK_Questions_Branches
    FOREIGN KEY (BranchId) REFERENCES Branches(BranchId);

    ALTER TABLE Questions
    ADD CONSTRAINT FK_Questions_Colleges
    FOREIGN KEY (CollegeId) REFERENCES Colleges(CollegeId);

    ALTER TABLE Questions
    ADD CONSTRAINT FK_Questions_Courses
    FOREIGN KEY (CourseId) REFERENCES Courses(CourseId);

    ALTER TABLE Questions
    ADD CONSTRAINT FK_Questions_Subjects
    FOREIGN KEY (SubjectId) REFERENCES Subjects(SubjectId);
END
");

            migrationBuilder.Sql(@"
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ExamQuestions')
BEGIN
    CREATE TABLE ExamQuestions (
        ExamQuestionId INT IDENTITY(1,1) PRIMARY KEY,

        ExamId INT NOT NULL,
        QuestionId INT NOT NULL,

        Section NVARCHAR(10) NULL,
        QuestionNumber INT NULL,
        MaxMarks DECIMAL(5,2) NULL,

        IsCompulsory BIT NOT NULL,

        CreatedBy NVARCHAR(MAX) NULL,
        CreatedDate DATETIME2 NOT NULL
    );

    ALTER TABLE ExamQuestions
    ADD CONSTRAINT FK_ExamQuestions_Exams
    FOREIGN KEY (ExamId) REFERENCES Exams(ExamId) ON DELETE NO ACTION;

    ALTER TABLE ExamQuestions
    ADD CONSTRAINT FK_ExamQuestions_Questions
    FOREIGN KEY (QuestionId) REFERENCES Questions(QuestionId) ON DELETE NO ACTION;
END
");

            migrationBuilder.CreateTable(
                name: "QuestionOptions",
                columns: table => new
                {
                    OptionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    OptionText = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionOptions", x => x.OptionId);
                    table.ForeignKey(
                        name: "FK_QuestionOptions_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExamQuestions_ExamId1",
                table: "ExamQuestions",
                column: "ExamId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamQuestions_QuestionId1",
                table: "ExamQuestions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamSections_ExamId1",
                table: "ExamSections",
                column: "ExamId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionOptions_QuestionId1",
                table: "QuestionOptions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_BranchId1",
                table: "Questions",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_CollegeId1",
                table: "Questions",
                column: "CollegeId");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_CourseId1",
                table: "Questions",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_SubjectId1",
                table: "Questions",
                column: "SubjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExamQuestions");

            migrationBuilder.DropTable(
                name: "ExamSections");

            migrationBuilder.DropTable(
                name: "QuestionOptions");

            migrationBuilder.DropTable(
                name: "Questions");
        }
    }
}
