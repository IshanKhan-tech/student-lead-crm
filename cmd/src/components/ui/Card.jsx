import React from 'react'

const Card = ({ dets }) => {

  const getStyles = () => {

    if (
      dets.title.includes("Enrolled")
    ) {

      return {
        bg: "from-green-50 to-green-100",
        border: "border-green-200",
        text: "text-green-700"
      }

    }

    if (
      dets.title.includes("Pending")
    ) {

      return {
        bg: "from-yellow-50 to-yellow-100",
        border: "border-yellow-200",
        text: "text-yellow-700"
      }

    }

    if (
      dets.title.includes("Interested")
    ) {

      return {
        bg: "from-red-50 to-red-100",
        border: "border-red-200",
        text: "text-red-600"
      }

    }

    return {

      bg: "from-[#F8F6F2] to-[#EEE8DE]",
      border: "border-[#DDD6CB]",
      text: "text-[#2B2B2B]"

    }

  }

  const styles = getStyles()

  return (

    <div className={`

      w-[118px]
      h-[92px]

      rounded-[22px]

      px-3
      py-3

      flex
      flex-col
      justify-center

      bg-gradient-to-br

      ${styles.bg}
      ${styles.border}

      border

      shadow-[0_4px_12px_rgba(0,0,0,0.04)]

      hover:-translate-y-1
      hover:scale-[1.02]

      transition-all
      duration-300

      overflow-hidden

    `}>

      <h1 className={`text-[24px] leading-none font-bold ${styles.text}`}>
        {dets.value}
      </h1>

      <p className='text-[10px] text-[#666] mt-2 font-semibold leading-3 break-words'>
        {dets.title}
      </p>

    </div>

  )

}

export default Card