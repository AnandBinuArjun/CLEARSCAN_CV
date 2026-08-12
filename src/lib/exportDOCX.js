import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export const exportDOCX = async (cvData, filename = 'resume.docx') => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = cvData;

  const children = [];

  // HEADER
  if (personalInfo.fullName) {
    children.push(
      new Paragraph({
        text: personalInfo.fullName.toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        alignment: 'center',
        spacing: { after: 100 },
      })
    );
    
    let contact = [];
    if (personalInfo.email) contact.push(personalInfo.email);
    if (personalInfo.phone) contact.push(personalInfo.phone);
    if (personalInfo.location) contact.push(personalInfo.location);
    if (personalInfo.linkedin) contact.push(personalInfo.linkedin);
    if (personalInfo.portfolio) contact.push(personalInfo.portfolio);
    
    if (contact.length > 0) {
      children.push(
        new Paragraph({
          children: [new TextRun(contact.join(' | '))],
          alignment: 'center',
          spacing: { after: 300 },
        })
      );
    }
  }

  // SUMMARY
  if (summary) {
    children.push(
      new Paragraph({
        text: 'PROFESSIONAL SUMMARY',
        heading: HeadingLevel.HEADING_2,
        border: { bottom: { color: 'auto', space: 1, value: 'single', size: 6 } },
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [new TextRun(summary)],
        spacing: { after: 200 },
      })
    );
  }

  // SKILLS
  if (skills.hard.length > 0 || skills.soft.length > 0) {
    children.push(
      new Paragraph({
        text: 'SKILLS',
        heading: HeadingLevel.HEADING_2,
        border: { bottom: { color: 'auto', space: 1, value: 'single', size: 6 } },
        spacing: { before: 200, after: 100 },
      })
    );
    if (skills.hard.length > 0) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Technical: ', bold: true }),
          new TextRun(skills.hard.join(', ')),
        ]
      }));
    }
    if (skills.soft.length > 0) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Professional: ', bold: true }),
          new TextRun(skills.soft.join(', ')),
        ]
      }));
    }
  }

  // EXPERIENCE
  if (experience.length > 0) {
    children.push(
      new Paragraph({
        text: 'EXPERIENCE',
        heading: HeadingLevel.HEADING_2,
        border: { bottom: { color: 'auto', space: 1, value: 'single', size: 6 } },
        spacing: { before: 300, after: 100 },
      })
    );
    experience.forEach(exp => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.title, bold: true }),
            new TextRun({ text: `\t${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}` })
          ],
          tabStops: [{ type: 'right', position: 9000 }],
          spacing: { before: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: exp.company, italics: true }),
            new TextRun({ text: `\t${exp.location}` })
          ],
          tabStops: [{ type: 'right', position: 9000 }],
          spacing: { after: 50 }
        })
      );
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach(b => {
          children.push(new Paragraph({ text: b, bullet: { level: 0 } }));
        });
      }
    });
  }

  // EDUCATION
  if (education.length > 0) {
    children.push(
      new Paragraph({
        text: 'EDUCATION',
        heading: HeadingLevel.HEADING_2,
        border: { bottom: { color: 'auto', space: 1, value: 'single', size: 6 } },
        spacing: { before: 300, after: 100 },
      })
    );
    education.forEach(edu => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true }),
            new TextRun({ text: `\t${edu.startDate ? edu.startDate + ' - ' : ''}${edu.endDate}` })
          ],
          tabStops: [{ type: 'right', position: 9000 }],
          spacing: { before: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, italics: true }),
            new TextRun({ text: `\t${edu.location}` })
          ],
          tabStops: [{ type: 'right', position: 9000 }],
          spacing: { after: 50 }
        })
      );
      if (edu.gpa) {
        children.push(new Paragraph({ text: `GPA: ${edu.gpa}` }));
      }
    });
  }

  // PROJECTS
  if (projects.length > 0) {
    children.push(
      new Paragraph({
        text: 'PROJECTS',
        heading: HeadingLevel.HEADING_2,
        border: { bottom: { color: 'auto', space: 1, value: 'single', size: 6 } },
        spacing: { before: 300, after: 100 },
      })
    );
    projects.forEach(proj => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true }),
            proj.link ? new TextRun({ text: ` | ${proj.link}` }) : new TextRun(''),
          ],
          spacing: { before: 100 }
        })
      );
      if (proj.techStack) {
        children.push(new Paragraph({ children: [new TextRun({ text: `Stack: ${proj.techStack}`, italics: true })], spacing: { after: 50 } }));
      }
      children.push(new Paragraph({ text: proj.description }));
    });
  }

  // CERTIFICATIONS
  if (certifications.length > 0) {
    children.push(
      new Paragraph({
        text: 'CERTIFICATIONS',
        heading: HeadingLevel.HEADING_2,
        border: { bottom: { color: 'auto', space: 1, value: 'single', size: 6 } },
        spacing: { before: 300, after: 100 },
      })
    );
    certifications.forEach(cert => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true }),
            new TextRun(` - ${cert.issuer} \t${cert.date}`)
          ],
          tabStops: [{ type: 'right', position: 9000 }],
          spacing: { before: 100 }
        })
      );
    });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  try {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
    return true;
  } catch (error) {
    console.error('Failed to export DOCX:', error);
    return false;
  }
};
