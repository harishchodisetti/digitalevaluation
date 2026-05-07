namespace DIGITALEVALUATION.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class Question
    {
        [Key]
        public int QuestionId { get; set; }

        [MaxLength(50)]
        public string? QuestionCode { get; set; }

        public string? QuestionText { get; set; }

        [MaxLength(500)]
        public string? QuestionImagePath { get; set; }

        [MaxLength(50)]
        public string? QuestionType { get; set; } // Theory / MCQ / Numerical

        [MaxLength(20)]
        public string? DifficultyLevel { get; set; } // Easy / Medium / Hard

        public int? CollegeId { get; set; }
        public int? CourseId { get; set; }
        public int? BranchId { get; set; }
        public int? SubjectId { get; set; }

        public int? Semester { get; set; }
        public int? UnitNumber { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? MaxMarks { get; set; }

        public bool IsOptional { get; set; } = false;

        [MaxLength(200)]
        public string? Tags { get; set; }

        public string? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        // Navigation
        [ForeignKey("CollegeId")]
        public College? College { get; set; }

        [ForeignKey("CourseId")]
        public Course? Course { get; set; }

        [ForeignKey("BranchId")]
        public Branch? Branch { get; set; }

        [ForeignKey("SubjectId")]
        public Subject? Subject { get; set; }
    }
}
