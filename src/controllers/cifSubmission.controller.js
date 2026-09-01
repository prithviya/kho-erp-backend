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
const cifSubmissionService = require("../services/cifSubmission.service");

const useLatestRecruitment = (submission) => {
  const history = Array.isArray(submission.recruitmentHistory)
    ? submission.recruitmentHistory
    : [];
  const latest = history.reduce((current, item) => (
    !current || item.rid > current.rid ? item : current
  ), submission.recruitment || null);

  if (latest) submission.recruitment = latest;
};

const normalizeLanguageLevel = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : normalized;
};

const getApplicationStatus = (submission) => {
  const currentSubmission = Array.isArray(submission)
    ? submission.reduce((latest, item) => (
      !latest || new Date(item.updatedAt || item.createdAt) > new Date(latest.updatedAt || latest.createdAt)
        ? item
        : latest
    ), null)
    : submission;
  const status = String(currentSubmission?.appliedStatus || currentSubmission?.status || "Pending")
    .trim()
    .toUpperCase();
  return {
    APPLIED: "Pending",
    OFFERED: "Selected",
    JOINED: "Selected",
    SHORTLISTED: "Shortlisted",
    REJECTED: "Rejected",
  }[status] || currentSubmission?.appliedStatus || currentSubmission?.status || "Pending";
};

// Create full submission
exports.create = asyncHandler(async (req, res) => {
  let { 
    personal, 
    academics, 
    experiences, 
    skills, 
    softwares, 
    languages, 
    references 
  } = req.body;

  try {
    if (typeof personal === 'string') personal = JSON.parse(personal);
    if (typeof academics === 'string') academics = JSON.parse(academics);
    if (typeof experiences === 'string') experiences = JSON.parse(experiences);
    if (typeof skills === 'string') skills = JSON.parse(skills);
    if (typeof softwares === 'string') softwares = JSON.parse(softwares);
    if (typeof languages === 'string') languages = JSON.parse(languages);
    if (typeof references === 'string') references = JSON.parse(references);
  } catch (err) {
    return ApiResponse.error(res, "Invalid JSON data in form fields", null, 400);
  }

  // Start transaction
  const sequelize = require("../model").sequelize;
  const transaction = await sequelize.transaction();

  try {
    // 1. Create Personal
    const personalData = await cifPersonal.create(personal, { transaction });

    const cifid = personalData.id;

    // 2. Create Academics
    if (academics && academics.length > 0) {
      const academicData = academics.map(edu => ({
        ...edu,
        candidateId: cifid
      }));
      await cifAcademic.bulkCreate(academicData, { transaction });
    }

    // 3. Create Experiences
    if (experiences && experiences.length > 0) {
      const experienceData = experiences.map(exp => ({
        ...exp,
        candidateId: cifid
      }));
      await cifExperience.bulkCreate(experienceData, { transaction });
    }

    // 4. Create Skills
    if (skills && skills.length > 0) {
      const skillData = skills.map(skill => ({
        ...skill,
        candidateId: cifid
      }));
      await cifSkill.bulkCreate(skillData, { transaction });
    }

    // 5. Create Softwares
    if (softwares && softwares.length > 0) {
      const softwareData = softwares.map(sw => ({
        ...sw,
        candidateId: cifid,
        toolName: sw.toolName || sw.tools,
        proficiencyLevel: sw.proficiencyLevel || sw.levels
      }));
      await cifSoftware.bulkCreate(softwareData, { transaction });
    }

    // 6. Create Languages
    if (languages && languages.length > 0) {
      const languageData = languages.map(lang => ({
        ...lang,
        candidateId: cifid,
        languageName: lang.languageName || lang.language,
        speakLevel: normalizeLanguageLevel(lang.speakLevel || lang.Speak),
        readLevel: normalizeLanguageLevel(lang.readLevel || lang.Read),
        writeLevel: normalizeLanguageLevel(lang.writeLevel || lang.Write)
      }));
      await cifLanguage.bulkCreate(languageData, { transaction });
    }

    // 7. Create References
    if (references && references.length > 0) {
      const referenceData = references.map(ref => ({
        ...ref,
        candidateId: cifid
      }));
      await cifReference.bulkCreate(referenceData, { transaction });
    }

    // 8. Create Submission record
    await cifSubmission.create({
      candidateId: cifid,
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
      },
      {
        model: recruitment,
        as: 'recruitmentHistory',
        required: false
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  
  const formattedSubmissions = submissions.map(sub => {
    const plainSub = sub.toJSON();
    useLatestRecruitment(plainSub);
    plainSub.status = getApplicationStatus(plainSub.submission);
    
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
            plainSub.appliedStatus = getApplicationStatus(plainSub.submission);
        }
        if (plainSub.recruitmentHistory && plainSub.recruitmentHistory.length > 0) {
            plainSub.history = plainSub.recruitmentHistory.map(historyItem => ({
                user: "System",
                action: historyItem.recruitmentStatus ? `Status: ${historyItem.recruitmentStatus}` : "Updated details",
                date: new Date(historyItem.updatedAt || historyItem.createdAt).toLocaleDateString(),
                time: new Date(historyItem.updatedAt || historyItem.createdAt).toLocaleTimeString(),
                hrFeedback: historyItem.hrScreeningFeedback,
                technicalFeedback: historyItem.technicalInterviewFeedback,
                mdFeedback: historyItem.mdFeedback,
                statusNote: historyItem.statusChangeNote,
                interviewMode: historyItem.interviewMode
            })).sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
        } else {
            plainSub.history = [
                {
                    user: "System",
                    action: plainSub.recruitment.recruitmentStatus ? `Status: ${plainSub.recruitment.recruitmentStatus}` : "Updated details",
                    date: new Date(plainSub.recruitment.updatedAt || plainSub.recruitment.createdAt).toLocaleDateString(),
                    time: new Date(plainSub.recruitment.updatedAt || plainSub.recruitment.createdAt).toLocaleTimeString(),
                    hrFeedback: plainSub.recruitment.hrScreeningFeedback,
                    technicalFeedback: plainSub.recruitment.technicalInterviewFeedback,
                    mdFeedback: plainSub.recruitment.mdFeedback,
                    statusNote: plainSub.recruitment.statusChangeNote,
                    interviewMode: plainSub.recruitment.interviewMode
                }
            ];
        }
    } else {
        plainSub.appliedStatus = getApplicationStatus(plainSub.submission);
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
  useLatestRecruitment(plainSub);
  plainSub.status = getApplicationStatus(plainSub.submission);
  
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
          plainSub.appliedStatus = getApplicationStatus(plainSub.submission);
      }
      if (plainSub.recruitmentHistory && plainSub.recruitmentHistory.length > 0) {
          plainSub.history = plainSub.recruitmentHistory.map(historyItem => ({
              user: "System",
              action: historyItem.recruitmentStatus ? `Status: ${historyItem.recruitmentStatus}` : "Updated details",
              date: new Date(historyItem.updatedAt || historyItem.createdAt).toLocaleDateString(),
              time: new Date(historyItem.updatedAt || historyItem.createdAt).toLocaleTimeString(),
              hrFeedback: historyItem.hrScreeningFeedback,
              technicalFeedback: historyItem.technicalInterviewFeedback,
              mdFeedback: historyItem.mdFeedback,
              statusNote: historyItem.statusChangeNote,
              interviewMode: historyItem.interviewMode
          })).sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
      } else {
          plainSub.history = [
              {
                  user: "System",
                  action: plainSub.recruitment.recruitmentStatus ? `Status: ${plainSub.recruitment.recruitmentStatus}` : "Updated details",
                  date: new Date(plainSub.recruitment.updatedAt || plainSub.recruitment.createdAt).toLocaleDateString(),
                  time: new Date(plainSub.recruitment.updatedAt || plainSub.recruitment.createdAt).toLocaleTimeString(),
                  hrFeedback: plainSub.recruitment.hrScreeningFeedback,
                  technicalFeedback: plainSub.recruitment.technicalInterviewFeedback,
                  mdFeedback: plainSub.recruitment.mdFeedback,
                  statusNote: plainSub.recruitment.statusChangeNote,
                  interviewMode: plainSub.recruitment.interviewMode
              }
          ];
      }
  } else {
      plainSub.appliedStatus = getApplicationStatus(plainSub.submission);
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

  try {
    const submission = await cifSubmissionService.updateStatus(cifid, status);

    return ApiResponse.success(
      res,
      `Application ${(submission.appliedStatus || submission.status || "Pending").toLowerCase()} successfully.`,
      {
        cifid,
        status: submission.appliedStatus || submission.status,
      }
    );
  } catch (error) {
    const message = error?.message || "Failed to update submission status.";
    const statusCode = error?.message?.includes("cannot") || error?.message?.includes("must be one of") ? 400 : 409;

    return ApiResponse.error(
      res,
      message,
      null,
      statusCode
    );
  }
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
      },
      {
        model: recruitment,
        as: 'recruitmentHistory',
        required: false
      }
    ]
  });
}
