const { 
  CifPersonal: cifPersonal, 
  CifAcademic: cifAcademic, 
  CifExperience: cifExperience, 
  CifSkill: cifSkill, 
  CifSoftware: cifSoftware, 
  CifLanguage: cifLanguage, 
  CifReference: cifReference,
  CifSubmission: cifSubmission,
  Opening: opening,
  Recruitment: recruitment
} = require("../model");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

// Create full submission
exports.create = asyncHandler(async (req, res) => {
  const { 
    personal, 
    academics, 
    experiences, 
    skills, 
    softwares, 
    languages, 
    references 
  } = req.body;

  // Start transaction
  const sequelize = require("../model").sequelize;
  const transaction = await sequelize.transaction();

  try {
    // 1. Create Personal
    const personalData = await cifPersonal.create(personal, { transaction });

    const cifid = personalData.cifid;

    // 2. Create Academics
    if (academics && academics.length > 0) {
      const academicData = academics.map(edu => ({
        ...edu,
        cifid: cifid
      }));
      await cifAcademic.bulkCreate(academicData, { transaction });
    }

    // 3. Create Experiences
    if (experiences && experiences.length > 0) {
      const experienceData = experiences.map(exp => ({
        ...exp,
        cifid: cifid
      }));
      await cifExperience.bulkCreate(experienceData, { transaction });
    }

    // 4. Create Skills
    if (skills && skills.length > 0) {
      const skillData = skills.map(skill => ({
        ...skill,
        cifid: cifid
      }));
      await cifSkill.bulkCreate(skillData, { transaction });
    }

    // 5. Create Softwares
    if (softwares && softwares.length > 0) {
      const softwareData = softwares.map(sw => ({
        ...sw,
        cifid: cifid
      }));
      await cifSoftware.bulkCreate(softwareData, { transaction });
    }

    // 6. Create Languages
    if (languages && languages.length > 0) {
      const languageData = languages.map(lang => ({
        ...lang,
        cifid: cifid
      }));
      await cifLanguage.bulkCreate(languageData, { transaction });
    }

    // 7. Create References
    if (references && references.length > 0) {
      const referenceData = references.map(ref => ({
        ...ref,
        cifid: cifid
      }));
      await cifReference.bulkCreate(referenceData, { transaction });
    }

    // 8. Create Submission record
    await cifSubmission.create({
      cifid: cifid,
      appliedStatus: "Pending"
    }, { transaction });

    // Commit transaction
    await transaction.commit();

    // Fetch complete data
    const completeData = await getCompleteSubmission(cifid);

    return ApiResponse.created(
      res,
      "Application submitted successfully.",
      completeData
    );

  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    throw error;
  }
});

// Get all submissions
exports.getAllSubmissions = asyncHandler(async (req, res) => {
  const submissions = await cifPersonal.findAll({
    include: [
      {
          model: opening,
          as: "opening",
          required: false,
          attributes: [
              "jobid",
              "jobTitle"
          ]
      },
      {
        model: cifAcademic,
        as: 'academics',
        required: false
      },
      {
        model: cifExperience,
        as: 'experiences',
        required: false
      },
      {
        model: cifSkill,
        as: 'skills',
        required: false
      },
      {
        model: cifSoftware,
        as: 'softwares',
        required: false
      },
      {
        model: cifLanguage,
        as: 'languages',
        required: false
      },
      {
        model: cifReference,
        as: 'references',
        required: false
      },
      {
        model: cifSubmission,
        as: 'submission',
        required: false
      },
      {
        model: recruitment,
        as: 'recruitment',
        required: false
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  
  const formattedSubmissions = submissions.map(sub => {
    const plainSub = sub.toJSON();
    plainSub.status = plainSub.submission ? plainSub.submission.appliedStatus : "Pending";
    
    if (plainSub.recruitment) {
        plainSub.interviewDate = plainSub.recruitment.interviewDateTime ? new Date(plainSub.recruitment.interviewDateTime).toISOString().slice(0, 16) : null;
        plainSub.interviewMode = plainSub.recruitment.interviewMode;
        plainSub.hrFeedback = plainSub.recruitment.hrScreeningFeedback;
        plainSub.technicalFeedback = plainSub.recruitment.technicalInterviewFeedback;
        plainSub.mdFeedback = plainSub.recruitment.mdFeedback;
        plainSub.statusNote = plainSub.recruitment.statusChangeNote;
        if (plainSub.recruitment.recruitmentStatus) {
            plainSub.appliedStatus = plainSub.recruitment.recruitmentStatus;
            plainSub.status = plainSub.recruitment.recruitmentStatus;
        } else {
            plainSub.appliedStatus = plainSub.submission ? plainSub.submission.appliedStatus : "Pending";
        }
        plainSub.history = [
            {
                user: "System",
                action: plainSub.recruitment.recruitmentStatus ? `Status: ${plainSub.recruitment.recruitmentStatus}` : "Updated details",
                date: new Date(plainSub.recruitment.updatedAt || plainSub.recruitment.createdAt).toLocaleDateString()
            }
        ];
    } else {
        plainSub.appliedStatus = plainSub.submission ? plainSub.submission.appliedStatus : "Pending";
        plainSub.history = [];
    }
    return plainSub;
  });

  return ApiResponse.success(
    res,
    "Submissions fetched successfully.",
    formattedSubmissions
  );
});

// Get single submission by cifid
exports.getSubmissionById = asyncHandler(async (req, res) => {
  const { cifid } = req.params;

  const submission = await getCompleteSubmission(cifid);

  if (!submission) {
    return ApiResponse.error(res, "Application not found.", 404);
  }

  const plainSub = submission.toJSON();
  plainSub.status = plainSub.submission ? plainSub.submission.appliedStatus : "Pending";
  
  if (plainSub.recruitment) {
      plainSub.interviewDate = plainSub.recruitment.interviewDateTime ? new Date(plainSub.recruitment.interviewDateTime).toISOString().slice(0, 16) : null;
      plainSub.interviewMode = plainSub.recruitment.interviewMode;
      plainSub.hrFeedback = plainSub.recruitment.hrScreeningFeedback;
      plainSub.technicalFeedback = plainSub.recruitment.technicalInterviewFeedback;
      plainSub.mdFeedback = plainSub.recruitment.mdFeedback;
      plainSub.statusNote = plainSub.recruitment.statusChangeNote;
      if (plainSub.recruitment.recruitmentStatus) {
          plainSub.appliedStatus = plainSub.recruitment.recruitmentStatus;
          plainSub.status = plainSub.recruitment.recruitmentStatus;
      } else {
          plainSub.appliedStatus = plainSub.submission ? plainSub.submission.appliedStatus : "Pending";
      }
      plainSub.history = [
          {
              user: "System",
              action: plainSub.recruitment.recruitmentStatus ? `Status: ${plainSub.recruitment.recruitmentStatus}` : "Updated details",
              date: new Date(plainSub.recruitment.updatedAt || plainSub.recruitment.createdAt).toLocaleDateString()
          }
      ];
  } else {
      plainSub.appliedStatus = plainSub.submission ? plainSub.submission.appliedStatus : "Pending";
      plainSub.history = [];
  }

  return ApiResponse.success(
    res,
    "Submission fetched successfully.",
    plainSub
  );
});

// Update submission status
exports.updateSubmissionStatus = asyncHandler(async (req, res) => {
  const { cifid } = req.params;
  const { status } = req.body;

  // Validate frontend status
  const validStatuses = [
    "Pending",
    "Shortlisted",
    "Rejected"
  ];

  if (!status || !validStatuses.includes(status)) {
    return ApiResponse.error(
      res,
      `Status must be one of: ${validStatuses.join(", ")}`,
      400
    );
  }

  // Find submission from cif_submissions table
  let submission = await cifSubmission.findOne({
    where: {
      cifid: cifid
    }
  });
  
  if (!submission) {
    submission = await cifSubmission.create({
      cifid: cifid,
      appliedStatus: "Pending"
    });
  }

  const currentStatus = String(submission.appliedStatus || "").trim().toLowerCase();
  if (status === "Shortlisted" && ["reject", "rejected", "selected"].includes(currentStatus)) {
    return ApiResponse.error(
      res,
      "Rejected or selected applications cannot be shortlisted.",
      409
    );
  }

  // Convert frontend status to database status
  const dbStatusMap = {
    Pending: "Pending",
    Shortlisted: "Shortlist",
    Rejected: "Reject"
  };

  const dbStatus = dbStatusMap[status];

  // Update status
  submission.appliedStatus = dbStatus;

  await submission.save();

  return ApiResponse.success(
    res,
    `Application ${status.toLowerCase()} successfully.`,
    {
      cifid,
      status
    }
  );
});

// Helper function to get complete submission
async function getCompleteSubmission(cifid) {
  return await cifPersonal.findByPk(cifid, {
    include: [
      {
          model: opening,
          as: "opening",
          required: false,
          attributes: [
              "jobid",
              "jobTitle"
          ]
      },
      {
        model: cifAcademic,
        as: 'academics',
        required: false
      },
      {
        model: cifExperience,
        as: 'experiences',
        required: false
      },
      {
        model: cifSkill,
        as: 'skills',
        required: false
      },
      {
        model: cifSoftware,
        as: 'softwares',
        required: false
      },
      {
        model: cifLanguage,
        as: 'languages',
        required: false
      },
      {
        model: cifReference,
        as: 'references',
        required: false
      },
      {
        model: cifSubmission,
        as: 'submission',
        required: false
      },
      {
        model: recruitment,
        as: 'recruitment',
        required: false
      }
    ]
  });
}
