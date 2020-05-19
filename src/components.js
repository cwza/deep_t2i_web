import React, { useState, useRef } from 'react'
import ReCAPTCHA from "react-google-recaptcha"

import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import ListGroup from 'react-bootstrap/ListGroup'

import { getImg } from './service'
import loading from './loading.svg'

const ResState = {
  init: "init",
  loading: "loading",
  success: "success",
  fail: "fail",
}

const Result = ({state, url, errorMsg}) => {
  switch (state) {
    case ResState.init:
      return (<div />)
    case ResState.loading:
      return (<Image src={loading} height="256" width="256" />)
    case ResState.success:
      return (<Image src={url} height="256" width="256" />)
    case ResState.fail:
      return (<Alert variant="danger">{errorMsg}</Alert>)
    default:
      return (<div />)
  }
}

const checkRecaptcha = process.env.REACT_APP_CHECK_RECAPTCHA
const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITEKEY
const Core = ({mode, cap}) => {
  const recaptchaRef = useRef(null)
  const [token, setToken] = useState(null)
  const [res, setRes] = useState({state: 'init', url: "", errorMsg: ""})
  const isBtnDisabled = () => checkRecaptcha==='true' && token===null
  const handleSubmit = () => {
    setRes({...res, state: ResState.loading})
    getImg(token, mode, cap)
    .then(url =>{
      setRes({...res, state: ResState.success, url})
    }).catch(e => {
      setRes({...res, state: ResState.fail, errorMsg: e.message})
    }).finally(()=>{
      if(recaptchaRef!==null && recaptchaRef.current!==null){ recaptchaRef.current.reset() }
      setToken(null)
    })
  }
  return (
    <div>
      <Row>
	{checkRecaptcha==='true' && <ReCAPTCHA ref={recaptchaRef} sitekey={recaptchaSiteKey} onChange={(token)=>setToken(token)} />}
        <Button className="btn-block" variant="primary" type="button" disabled={isBtnDisabled()} onClick={handleSubmit}>{isBtnDisabled()?"Please Click Recaptcha":"Get Image"}</Button>
      </Row>
      <Row><Result {...res} /></Row>
    </div>
  )
}

const AnimeHeads = () => {
  const hairs = ['orange hair', 'white hair', 'aqua hair', 'gray hair','green hair', 'red hair',
                  'purple hair', 'pink hair','blue hair', 'black hair', 'brown hair', 'blonde hair']
  const eyes = ['black eyes', 'orange eyes', 'purple eyes', 'pink eyes', 'yellow eyes', 'aqua eyes', 
                'green eyes', 'brown eyes', 'red eyes', 'blue eyes']
  const [hair, setHair] = useState(hairs[0])
  const [eye, setEye] = useState(eyes[0])
  return (
    <Container>
      <Row><h2>Anime Face</h2></Row>
      <Row><h4>Generate an anime face by machine. You can specify hair and eye color.</h4></Row>
      <Row>
	<Col>
          <Form.Control as="select" onChange={(e)=>setHair(e.target.value)}>
            {hairs.map((hair, idx)=><option key={idx} value={hair}>{hair}</option>)}
          </Form.Control>
	</Col>
	<Col>
          <Form.Control as="select" onChange={(e)=>setEye(e.target.value)}>
            {eyes.map((eye, idx)=><option key={idx} value={eye}>{eye}</option>)}
          </Form.Control>
	</Col>
      </Row>
        
      <Core mode="anime_heads" cap={`${hair} ${eye}`}/>
    </Container>
  )
}

const Birds = () => {
  const [cap, setCap] = useState("")
  const examples = [
	  "this bird has a white breast and crown, yellow bill and black tipped primaries.", 
	  "this brown and white bird has a large wingspan and an orange bill.", 
	  "this bird is flying through the air and has a large wing span.", 
	  "this is a white bird with a grey cheek patch and a black eyebrow.",
	  "his bird is white and brown in color, with a long curved beak.",
  ]
  return (
    <Container>
      <Row><h2>Birds</h2></Row>
      <Row><h4>Generate a bird by machine. You can specify any string that describe a bird.</h4></Row>
      <Row>
        <Form.Control as="textarea" rows="2" placeholder="Please input a string that describe a bird" value={cap} onChange={e=>setCap(e.target.value)} />
      </Row>
      <Row>
	<Col>
        <ListGroup>
          <ListGroup.Item key={-1} disabled>Examples:</ListGroup.Item>
	  {examples.map((example, idx)=>(
	    <ListGroup.Item key={idx} action value={example} onClick={e=>setCap(e.target.value)}>{example}</ListGroup.Item>
	  ))}
        </ListGroup>
	</Col>
      </Row>
      <Core mode="birds" cap={cap}/>
    </Container>
  )
}

export {AnimeHeads, Birds}
