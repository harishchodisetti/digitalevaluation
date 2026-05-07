using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DIGITALEVALUATION.Migrations
{
    /// <inheritdoc />
    public partial class answershht : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RevaluationMarks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RevaluationDetailId = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    OldMarks = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    NewMarks = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RevaluationMarks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RevaluationMarks_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RevaluationMarks_RevaluationDetails_RevaluationDetailId",
                        column: x => x.RevaluationDetailId,
                        principalTable: "RevaluationDetails",
                        principalColumn: "RevaluationDetailId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentAnswers",
                columns: table => new
                {
                    StudentAnswerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AnswerSheetId = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    AnswerText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MarksAwarded = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EvaluatorRemarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EvaluatedBy = table.Column<int>(type: "int", nullable: true),
                    EvaluatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentAnswers", x => x.StudentAnswerId);
                    table.ForeignKey(
                        name: "FK_StudentAnswers_AnswerSheets_AnswerSheetId",
                        column: x => x.AnswerSheetId,
                        principalTable: "AnswerSheets",
                        principalColumn: "AnswerSheetId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentAnswers_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "QuestionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RevaluationMarks_QuestionId",
                table: "RevaluationMarks",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_RevaluationMarks_RevaluationDetailId",
                table: "RevaluationMarks",
                column: "RevaluationDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAnswers_AnswerSheetId",
                table: "StudentAnswers",
                column: "AnswerSheetId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAnswers_QuestionId",
                table: "StudentAnswers",
                column: "QuestionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RevaluationMarks");

            migrationBuilder.DropTable(
                name: "StudentAnswers");
        }
    }
}
