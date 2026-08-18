const { 
  CifPersonal: cifPersonal, 
  CifAcademic: cifAcademic, 
  CifExperience: cifExperience, 
  CifSkill: cifSkill, 
  CifSoftware: cifSoftware, 
  CifLanguage: cifLanguage, 
  CifReference: cifReference,
  Opening: opening
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
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return ApiResponse.success(
    res,
    "Submissions fetched successfully.",
    submissions
  );
});

// Get single submission by cifid
exports.getSubmissionById = asyncHandler(async (req, res) => {
  const { cifid } = req.params;

  const submission = await getCompleteSubmission(cifid);

  if (!submission) {
    return ApiResponse.error(res, "Application not found.", 404);
  }

  return ApiResponse.success(
    res,
    "Submission fetched successfully.",
    submission
  );
});

// Update submission status
exports.updateSubmissionStatus = asyncHandler(async (req, res) => {
  const { cifid } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ['Pending', 'Shortlisted', 'Selected', 'Rejected'];
  if (!status || !validStatuses.includes(status)) {
    return ApiResponse.error(
      res, 
      `Status must be one of: ${validStatuses.join(', ')}`,
      400
    );
  }

  // Find and update
  const personal = await cifPersonal.findByPk(cifid);

  if (!personal) {
    return ApiResponse.error(res, "Application not found.", 404);
  }

  // Update status (you need to add status field to cif_personals model)
  // Option 1: If you have status column in cif_personals
  personal.status = status;
  await personal.save();

  // Option 2: If you want to store status in a separate table
  // Or you can just update and return

  return ApiResponse.success(
    res,
    `Application ${status.toLowerCase()} successfully.`,
    { cifid, status }
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
      }
    ]
  });
}
