 using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DIGITALEVALUATION.Migrations
{
    /// <inheritdoc />
    public partial class revaluation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RevaluationRequests')
BEGIN
    CREATE TABLE RevaluationRequests (
        RevaluationRequestId INT IDENTITY(1,1) PRIMARY KEY,

        StudentId INT NOT NULL,
        ExamId INT NOT NULL,
        SubjectId INT NOT NULL,

        OriginalMarks DECIMAL(5,2) NULL,
        Reason NVARCHAR(500) NULL,
        RequestDate DATETIME2 NOT NULL,
        Status NVARCHAR(20) NULL,

        ApprovedBy INT NULL,
        ApprovedDate DATETIME2 NULL,
        Remarks NVARCHAR(500) NULL,

        CreatedBy NVARCHAR(MAX) NULL,
        CreatedDate DATETIME2 NOT NULL,
        UpdatedBy NVARCHAR(MAX) NULL,
        UpdatedDate DATETIME2 NULL,

        IsActive BIT NOT NULL,
        IsDeleted BIT NOT NULL
    );

    ALTER TABLE RevaluationRequests
    ADD CONSTRAINT FK_RevaluationRequests_Students 
   FOREIGN KEY (StudentId) REFERENCES Students(StudentId);

    ALTER TABLE RevaluationRequests
   ADD CONSTRAINT FK_RevaluationRequests_Exams 
   FOREIGN KEY (ExamId) REFERENCES Exams(ExamId);

    ALTER TABLE RevaluationRequests
    ADD CONSTRAINT FK_RevaluationRequests_Subjects 
    FOREIGN KEY (SubjectId) REFERENCES Subjects(SubjectId);
END
");

            migrationBuilder.CreateTable(
                name: "RevaluationAssignments",
                columns: table => new
                {
                    RevaluationAssignmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RevaluationRequestId = table.Column<int>(type: "int", nullable: false),
                    FacultyId = table.Column<int>(type: "int", nullable: false),
                    AssignedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RevaluationAssignments", x => x.RevaluationAssignmentId);
                    table.ForeignKey(
                        name: "FK_RevaluationAssignments_Faculties_FacultyId",
                        column: x => x.FacultyId,
                        principalTable: "Faculties",
                        principalColumn: "FacultyId",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_RevaluationAssignments_RevaluationRequests_RevaluationRequestId",
                        column: x => x.RevaluationRequestId,
                        principalTable: "RevaluationRequests",
                        principalColumn: "RevaluationRequestId",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "RevaluationDetails",
                columns: table => new
                {
                    RevaluationDetailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RevaluationRequestId = table.Column<int>(type: "int", nullable: false),
                    FacultyId = table.Column<int>(type: "int", nullable: false),
                    OldMarks = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    NewMarks = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    DifferenceMarks = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EvaluatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Remarks = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RevaluationDetails", x => x.RevaluationDetailId);
                    table.ForeignKey(
                        name: "FK_RevaluationDetails_Faculties_FacultyId",
                        column: x => x.FacultyId,
                        principalTable: "Faculties",
                        principalColumn: "FacultyId",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_RevaluationDetails_RevaluationRequests_RevaluationRequestId",
                        column: x => x.RevaluationRequestId,
                        principalTable: "RevaluationRequests",
                        principalColumn: "RevaluationRequestId",
                        onDelete: ReferentialAction.NoAction);
                }
                );

            migrationBuilder.CreateIndex(
                name: "IX_RevaluationAssignments_FacultyId",
                table: "RevaluationAssignments",
                column: "FacultyId");

            migrationBuilder.CreateIndex(
                name: "IX_RevaluationAssignments_RevaluationRequestId",
                table: "RevaluationAssignments",
                column: "RevaluationRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_RevaluationDetails_FacultyId",
                table: "RevaluationDetails",
                column: "FacultyId");

            migrationBuilder.CreateIndex(
                name: "IX_RevaluationDetails_RevaluationRequestId",
                table: "RevaluationDetails",
                column: "RevaluationRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_RevaluationRequests_ExamId",
                table: "RevaluationRequests",
                column: "ExamId");

            migrationBuilder.CreateIndex(
                name: "IX_RevaluationRequests_StudentId",
                table: "RevaluationRequests",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_RevaluationRequests_SubjectId",
                table: "RevaluationRequests",
                column: "SubjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RevaluationAssignments");

            migrationBuilder.DropTable(
                name: "RevaluationDetails");

            migrationBuilder.DropTable(
                name: "RevaluationRequests");
        }
    }
}
