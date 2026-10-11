import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { QuestionFilterSection } from '@/components/question-filters/question-filter-section'
import { useQuizSetup } from '@/hooks/quiz-setup.hook'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { useMemo, useState } from 'react'
import { useSetupContent } from '@/hooks'

import { BibleKey } from '@bq/shared/types'

type QuestionFilterMode = 'MONTHS' | 'BIBLE'

const FILTERS = {
  MONTHS: 'Months',
  BIBLE: 'Bible Reference',
} as const

export default function MaterialSelection () {
  const { filterSection } = useSetupContent()
  const {
    updateFilterCriteria: updateFilter,
    data,
    defualtQuizFilters,
    updateBibleRef,
  } = useQuizSetup()
  const { questionFilters } = data

  console.debug(defualtQuizFilters.bookRange, 'jjjkj')
  const [openBook, setOpenBook] = useState<string>('')
  const [materialSelected, setMaterialSelected] =
    useState<QuestionFilterMode>('MONTHS')

  //     const bookRangeOptions = useMemo(() => {
  //   return (Object.keys(defualtQuizFilters.bookRange) as BibleKey []).reduce((acc, bookName) => {
  //     acc[bookName] = (defualtQuizFilters.bookRange[bookName] ?? []).map((b) => ({
  //       value: String(b),
  //       label: String(b),
  //     }));
  //     return acc;
  //   }, {} as Record<BibleKey, { value: string; label: string }[]>);
  // }, [])

  console.debug('filter', questionFilters)

  return (
    <View>
      <View className='mb-4 flex-row gap-2'>
        <Button
          onPress={() => setMaterialSelected('MONTHS')}
          variant={materialSelected === 'MONTHS' ? 'default' : 'outline'}
          className='flex-1 rounded-md'
        >
          <Text>{FILTERS.MONTHS}</Text>
        </Button>
        <Button
          onPress={() => setMaterialSelected('BIBLE')}
          variant={materialSelected === 'BIBLE' ? 'default' : 'outline'}
          className='flex-1 rounded-md'
        >
          <Text>{FILTERS.BIBLE}</Text>
        </Button>
      </View>

      <View className='mb-4'>
        {materialSelected === 'MONTHS'
          ? (
            <View>
              <QuestionFilterSection
                type='multi'
                name={filterSection.questionType.title}
                title={filterSection.months.title}
                options={filterSection.months.options}
                value={(questionFilters?.month as string[]) ?? []}
                onChange={(val) => updateFilter('month', val)}
              />
            </View>
            )
          : (
            <Accordion
              type='single'
              value={openBook}
              onValueChange={(value: string | undefined) =>
                setOpenBook(value ?? '')}
              collapsible
            >
              {Object.keys(defualtQuizFilters.bookRange).map((bookName) => (
                <AccordionItem key={bookName} value={`material-${bookName}`}>
                  <AccordionTrigger>
                    <Text>{bookName}</Text>
                  </AccordionTrigger>

                  <AccordionContent>
                    <QuestionFilterSection
                      variant='circle'
                      type='multi'
                      name={filterSection.questionType.title}
                      title={filterSection.questionType.title}
                      options={
                      defualtQuizFilters.bookRange[bookName as BibleKey] ?? []
                    }
                      value={
                      questionFilters?.bookRange[bookName as BibleKey] ?? []
                    }
                      onChange={(val) =>
                        updateBibleRef(bookName as BibleKey, val)}
                      isWrapLayout
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            )}
      </View>
    </View>
  )
}
