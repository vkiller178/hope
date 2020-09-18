import React, { useState } from 'react'
import { NextPage } from 'next'
import Menu from '../../components/menu'
import { menus } from '../../js/const'
import { PageContent } from '../../components/common/page'
import { get } from '../../js/request'
import styled, { createGlobalStyle } from 'styled-components'
import { ResumeModel } from '../../../db/models'
import {
  PhoneOutlined,
  ToolOutlined,
  ApiOutlined,
  LaptopOutlined,
  SmileOutlined,
  FileProtectOutlined,
} from '@ant-design/icons'
import Head from 'next/head'

import { Spin, message } from 'antd'

enum contactMap {
  'phone' = '手机',
  'email' = '邮箱',
  'site' = '网站',
  'github' = 'Github',
}

const G = createGlobalStyle`
  @media print {
    @page {
      margin: 1.5cm 0;
      size: A4;
    }
    .menu,#print-button {
      display: none;
    }

    body {
      height: auto;
      font-size: 14px;
      color: black;
    }

    * {
      page-break-inside: always;
    }
    h2 {
      page-break-after: avoid;
      page-break-before: avoid;
    }
  }

`

const ResumeContent = styled('div')`
  margin: 0 auto;

  max-width: 20.5cm;
  /* word-break: keep-all; */
  font-size: 14px;

  overflow-x: hidden;

  .github-fork-ribbon {
    cursor: pointer;
    z-index: 998;
    &::before,
    &::after {
      box-sizing: content-box !important;
    }
  }

  &::-webkit-scrollbar {
    width: 0 !important;
  }
  & > div,
  & > section {
    margin-bottom: 16px;
  }

  h2 .anticon {
    margin-right: 4px;
  }

  .base-info {
    display: flex;
    padding-right: 48px;
    flex-wrap: wrap;
    .main {
      display: flex;
      align-items: flex-start;
      flex: 1;
      .avatar {
        height: 150px;
        width: 107px;
        background-size: cover;
        background-position: center;
        margin-right: 24px;
        position: relative;
        &::after {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background-color: gray;
          content: ' ';
        }
      }

      & > section {
        min-width: 180px;
      }

      & .avatar {
        flex-shrink: 0;
      }
    }
  }

  .skills-list {
    p {
      margin-bottom: 0.5em;
    }
  }

  .projects-list {
    .desc {
      margin-bottom: 0;
    }
    .desc,
    .skills {
      font-style: italic;
      font-size: 14px;
    }
  }

  .exp-item {
    padding: 0 4px;
  }
`

const renderExp = (exp: Resume.Exp) => {
  return (
    <section key={exp.company}>
      <h3>{exp.company}</h3>
      <h4>
        {exp.title}
        {exp.keywords.split(',').map((t) => (
          <span className="exp-item" key={t}>
            ✅{t}
          </span>
        ))}
      </h4>
      <p dangerouslySetInnerHTML={{ __html: exp.tasks }}></p>
    </section>
  )
}

const renderProject = (project: Resume.Project) => (
  <section key={project.name}>
    <h3>{project.name}</h3>
    <p className="desc">简介：{project.desc}</p>
    <p className="skills">技术栈：{project.technique}</p>
    <p dangerouslySetInnerHTML={{ __html: project.detail }}></p>
  </section>
)

const renderContact = (contact: Resume.Contact) => {
  return (
    <section key={contact.value}>
      <span>{contactMap[contact.type]}：</span>
      <span dangerouslySetInnerHTML={{ __html: contact.value }}></span>
    </section>
  )
}

const renderSkill = (skill: string, index: number) => {
  return (
    <p key={skill}>
      {index + 1}、{skill}
    </p>
  )
}

const renderEdu = (edu: Resume.Edu) => {
  return (
    <section key={edu.name}>
      <h3>{edu.name}</h3>
      <h4>
        {edu.duration}/{edu.subject}/{edu.level}
      </h4>
    </section>
  )
}

const Friends: NextPage<{ resume: ResumeModel }> = ({ resume }) => {
  const [loading, setLoading] = useState<boolean>(false)

  const printResume = () => {
    if (window.innerWidth < 1080) {
      message.warning('打印功能仅支持PC设备')
      return
    }
    window.print()
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/github-fork-ribbon-css@0.2.3/gh-fork-ribbon.css"
        />
      </Head>
      <G />
      <Menu className="menu" menus={menus} />
      <Spin spinning={loading}>
        <PageContent>
          <ResumeContent id="resume-content">
            <div
              id="print-button"
              className="github-fork-ribbon"
              data-ribbon="打印"
              title="打印"
              onClick={printResume}
            >
              打印
            </div>

            <div className="base-info">
              {/* 基本信息 */}
              <div className="main">
                {/* <div
                  className="avatar"
                  style={{ backgroundImage: `url(${resume.user.avatar})` }}
                /> */}
                <section>
                  <h2>{resume.nickname}</h2>
                  <h3>{resume.intro}</h3>
                </section>
              </div>

              {/* 联系方式 */}
              <section>
                <h2>
                  <PhoneOutlined />
                  联系方式
                </h2>
                <div>{resume.contact.map(renderContact)}</div>
              </section>
            </div>

            {/* 技能树 */}
            <section className="skills-list">
              <h2>
                <ToolOutlined />
                技术栈
              </h2>
              <div>{resume.skills.map(renderSkill)}</div>
            </section>
            {/* 教育经历 */}
            <section>
              <h2>
                <ApiOutlined />
                教育经历
              </h2>
              <div>{resume.education.map(renderEdu)}</div>
            </section>
            {/* 工作经历 */}
            <section>
              <h2>
                <LaptopOutlined />
                工作经历
              </h2>
              <div>{resume.experience.map(renderExp)}</div>
            </section>
            {/* 项目经历 */}
            <section className="projects-list">
              <h2>
                <FileProtectOutlined />
                项目经历
              </h2>
              <div>{resume.projects.map(renderProject)}</div>
            </section>
            {/* 自我介绍 */}
            <section>
              <h2>
                <SmileOutlined />
                自我介绍
              </h2>
              <p dangerouslySetInnerHTML={{ __html: resume.detail }} />
            </section>
          </ResumeContent>
        </PageContent>
      </Spin>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const { uid } = ctx.query
  const resume = await get<ResumeModel>(`$/open/resumeByUser/${uid}`)
  return { props: { resume } }
}

export default Friends
