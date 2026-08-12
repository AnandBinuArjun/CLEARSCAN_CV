import { saveAs } from 'file-saver';

export const exportTXT = (cvData, filename = 'resume.txt') => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = cvData;
  let text = '';

  const addLine = (str = '') => { text += str + '\n'; };
  const addDivider = () => { addLine('-'.repeat(40)); };

  // HEADER
  if (personalInfo.fullName) {
    addLine(personalInfo.fullName.toUpperCase());
    let contact = [];
    if (personalInfo.email) contact.push(personalInfo.email);
    if (personalInfo.phone) contact.push(personalInfo.phone);
    if (personalInfo.location) contact.push(personalInfo.location);
    if (personalInfo.linkedin) contact.push(personalInfo.linkedin);
    if (personalInfo.portfolio) contact.push(personalInfo.portfolio);
    if (contact.length > 0) addLine(contact.join(' | '));
    addLine();
  }

  // SUMMARY
  if (summary) {
    addLine('PROFESSIONAL SUMMARY');
    addDivider();
    addLine(summary);
    addLine();
  }

  // SKILLS
  if (skills.hard.length > 0 || skills.soft.length > 0) {
    addLine('SKILLS');
    addDivider();
    if (skills.hard.length > 0) addLine(`Technical: ${skills.hard.join(', ')}`);
    if (skills.soft.length > 0) addLine(`Professional: ${skills.soft.join(', ')}`);
    addLine();
  }

  // EXPERIENCE
  if (experience.length > 0) {
    addLine('EXPERIENCE');
    addDivider();
    experience.forEach(exp => {
      addLine(`${exp.title} at ${exp.company} (${exp.location})`);
      addLine(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`);
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach(b => addLine(`- ${b}`));
      }
      addLine();
    });
  }

  // EDUCATION
  if (education.length > 0) {
    addLine('EDUCATION');
    addDivider();
    education.forEach(edu => {
      addLine(`${edu.degree} from ${edu.institution} (${edu.location})`);
      addLine(`${edu.startDate ? edu.startDate + ' - ' : ''}${edu.endDate}`);
      if (edu.gpa) addLine(`GPA: ${edu.gpa}`);
      addLine();
    });
  }

  // PROJECTS
  if (projects.length > 0) {
    addLine('PROJECTS');
    addDivider();
    projects.forEach(proj => {
      addLine(`${proj.name}${proj.link ? ` | ${proj.link}` : ''}`);
      if (proj.techStack) addLine(`Stack: ${proj.techStack}`);
      addLine(proj.description);
      addLine();
    });
  }

  // CERTIFICATIONS
  if (certifications.length > 0) {
    addLine('CERTIFICATIONS');
    addDivider();
    certifications.forEach(cert => {
      addLine(`${cert.name} - ${cert.issuer} (${cert.date})`);
    });
    addLine();
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, filename);
  return true;
};
