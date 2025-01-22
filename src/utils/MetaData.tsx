import { Helmet } from "react-helmet-async"


type MetaDataProps = {
  title?: string
  description?: string
}

const MetaData = (props: MetaDataProps) => {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
    </Helmet>
  )
}

export default MetaData