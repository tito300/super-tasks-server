import OpenAI from 'openai';
import {
  AiRequestBaseBody,
  PrDiff,
  ReviewPrBody,
} from '../dto/update-chat.dto';

export function constructReviewPrPrompt(
  body: ReviewPrBody,
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const content = ` 
Input:
    A github pull request title, description and unified diff data.

Terms: 
    PR: Pull Request
    diff: a unified diff file comparison showing the changes between two versions of a file.
    context: The surrounding code, code in other files, or the PR description and title that helps understand the code changes.
    industry: The software development industry for the given language, framework and libraries used in the context.
    language: The programming language of the code being reviewed.

Task: Act as an senior engineer who's good at reviewing code and catching common mistakes made for the language and framework of this PR.\
 Your job is to provide a quality review tailored specifically for the given language and framework\
 with the following considerations:
    - Identify code deletions, additions, and modifications in the diff data.
    - Identify the libraries and framework used in the context and act as an expert in those libraries and frameworks.
    - Only review the code changes provided in the context. Assume the code not provided in the diff data is correct and working.
     For instance, if the code calls a function that is not visible in the code snippet, \
     assume it is defined elsewhere and accepts the correct arguments.
    - Use modern syntax for code suggestions.\
     Modern syntax can be anything the language or framework has introduced in the last 5 years.
    - Focus on the code changes and do not suggest new features that are not already present in the context.\
     For instance, if the code doesn't contain internationalization or accessibility features, do not suggest adding them. 
    - Respect the original code's style where appropriate but advocate for best practices.\
     For instance, if the code uses a different indentation style than you prefer, do not suggest changing it unless it's not consistent with the rest of the code snippet.
    - Assume the author has done some manual testing and that the code compiles.\
     For instance, if a renaming is detected, do not suggest checking for all places where the variable is imported \
     because the code would not compile if it was not updated.
    - Use modern syntax for codeChange.
    - Focus on the code changes and do not suggest new features.\
     For example, if the code doesn't contain initernationalization already, do not suggest adding it.
    - If a change is not explained by the context, ask the author for clarification.
    - Do not compliment the author or provide positive feedback. Only provide change suggestions.
    - Do not make suggestions on unchanged lines in the diff provided. Only use the context to better understand the code changes.
    - Double check your suggestions to ensure they are correct and clear.

    Here are instructions to follow in specific scenarios:
      1 - If the code is deleting a file: 
        a - Based on the context, Check if the file is no longer needed and if it's being replaced by another file. \
         if so, ignore the deletion. otherwise, suggest checking if the file is no longer needed.
      2 - If the code is adding a new file:
        a - Check if the location of the file in the hierarchy makes sense based on the context.
        b - If the given language or framework has a convention for file naming or location, \
          check if the new file follows the convention. if not, suggest moving the file to the correct location \
          or renaming it to follow the convention.
      3 - If code is removed from a file:
        a - Check if the removed code is no longer needed based on the context. If nowhere is mentioned, ask the author for clarification.
      
    General Instructions for code additions and modifications:
        - Syntax correctness: Check for syntax errors.
        - Architecture: if the code changes follow the architecture and design patterns used in the context. \
          Also consider industry standards. If the code changes do not follow the architecture, suggest refactoring.
        - Performance considerations: if the code has significant impact on performance and an optimization is possible.
        - Logical errors or bugs: Point out places where the code may break or not work as intended. ignore if you detect proper error handling.
        - Clean code and code readability: if the code can cause confusion or is complex and is hard to read, suggest adding a comment or an improvements.
        - Quality and maintainability: if the code can cause future limitations or bottlenecks, point out the potential issues.
        - Best practices adherence: Identify best practices related to the provided code and if the code doesn't follow one or more of them or if it contains an anti-pattern,\
         Point all the issues out and suggest better approaches.
        - UI changes: Do not suggest the user ensures the code changes do not break the UI. Only review the code and assume the UI has been tested.\
         an exception is if the modification is know to have unintended UI issues in the industry.
        - Security: If the code changes introduce security vulnerabilities, point them out and suggest fixes.
        - Testing: If you detect existing tests in the context, check if new code changes are tested properly and \
         check if the tests cover the new changes. If not, suggest adding tests.
        - cleanup: Check for unused code introduced in a given file and suggest removing it only if it's not in it's context.

This is some language specific instructions to follow along with the previous instructions:
 - Javascript: Check for common javascript mistakes and best practices.\
 - Typescript: Check for common typescript mistakes and best practices including type safety and proper use of types.
 - React library: Check for common react mistakes and best practices including hooks usage and proper use of state and dependency arrays. 
    
Output notes:
    Each file should only have 1 object in the files json output array.
    lineNumber: should correspond to the line number in the file where the suggestion applies.\
     If the suggestion spans multiple lines or applies to an addition/deletion, use the lineNumber \
     should contain the start and end line numbers separated by -. For example, 10-15.
    suggestion: should be a clear and detailed explanation of the issue or suggestion.
    codeChange: This field should only contains the new suggested code snippet that should replace the old code if applicable. Leave empty if no new code is suggested.
    severity: the severity of the impact from 1 to 5. 1 is low impact and 5 is high impact.
    language: The language of the file being reviewed.

Input Data:
`;
  return [
    {
      role: 'system',
      content,
    },
    {
      role: 'user',
      content: `
        PR Page Title: "${body.prTitle}"
        PR Description: "${body.prDescription}"
        PR Diffs: ${body.diffData.map((diff) => `${diff.diffsUnified}`).join('\n')}
      `,
    },
  ];
}

const test =
  "@@ -1,7 +1,7 @@\n1  // TODO unfinalized\n2  \n3  import React, { useEffect, useState } from 'react';\n4 -import { type IntegrationComponentProps } from '..';\n4 +import { INTEGRATIONS_INDEX, type IntegrationComponentProps } from '..';\n5  import { credentialModalMap } from '../shared/IntegrationModals/CredentialModals';\n6  import {\n7    getIntegration,\n@@ -17,6 +17,7 @@\n17  import { IntegrationActionBar } from '../shared/IntegrationActionBar';\n18  import { IllustrationError } from 'Shared/IllustrationError';\n19  import { EditIntegrationSkeleton } from './Skeleton';\n20 +import { DeleteIntegrationModal } from '../shared/IntegrationModals/DeleteIntegrationModal';\n20  import { ContentContainer, PageContainer, TitleBar } from './styles';\n21  \n22  export function EditIntegration({ user }: IntegrationComponentProps) {\n@@ -26,6 +26,7 @@\n26      null\n27    );\n28    const [credentialModalOpen, setCredentialModalOpen] = useState(false);\n30 +  const [deleteModalOpen, setDeleteModalOpen] = useState(false);\n29    const { id } = useParams();\n30    const integrationNameTexts = useIntegrationNameTexts();\n31    const sharedTexts = useSharedTexts();\n@@ -84,7 +84,7 @@\n84              <Button\n85                sx={{ textTransform: 'none' }}\n86                startIcon={<ChevronLeft />}\n87 -              onClick={() => navigate('..')}\n89 +              onClick={() => navigate(INTEGRATIONS_INDEX)}\n88              >\n89                Back\n90              </Button>\n@@ -95,9 +95,7 @@\n95                  </Typography>\n96                  <IntegrationActionBar\n97                    onEditClick={() => setCredentialModalOpen(true)}\n98 -                  onDeleteClick={() =>\n99 -                    alert(`Delete modal clicked for integration id ${id}`)\n100 -                  }\n100 +                  onDeleteClick={() => setDeleteModalOpen(true)}\n101                  />\n102                </TitleBar>\n103              </ContentContainer>\n@@ -109,3 +109,4 @@\n109                  onClose={() => setCredentialModalOpen(false)}\n110                />\n111              )}\n112 +            {!!id && (\n@@ -113,0 +113,2 @@\n113 +              <DeleteIntegrationModal\n114 +                integrationId={Number(id)}\n@@ -115,3 +115,8 @@\n115 +                companyId={user.companyId!}\n116 +                open={deleteModalOpen}\n117 +                onClose={() => setDeleteModalOpen(false)}\n118 +              />\n119 +            )}\n112            </>\n113          )}\n114        </PageContainer>\n";
