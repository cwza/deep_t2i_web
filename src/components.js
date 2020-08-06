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

const Result = ({state, url, errorMsg, mode}) => {
  let height = mode==='anime_heads'?"128":"256"
  let width = height
  switch (state) {
    case ResState.init:
      return (<div />)
    case ResState.loading:
      return (<Image src={loading} height={height} width={width} />)
    case ResState.success:
      return (<Image src={url} height={height} width={width} />)
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
  const isBtnDisabled = () => checkRecaptcha==='true' && (token===null || res.state===ResState.loading)
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
      <Row><Result {...res} mode={mode} /></Row>
    </div>
  )
}

const AnimeHeads = () => {
  const hairs = ['orange hair', 'white hair', 'aqua hair', 'gray hair','green hair', 'red hair',
                  'purple hair', 'pink hair','blue hair', 'black hair', 'brown hair', 'blonde hair']
  const eyes = ['black eyes', 'orange eyes', 'purple eyes', 'pink eyes', 'yellow eyes', 'aqua eyes', 
                'green eyes', 'brown eyes', 'red eyes', 'blue eyes']
  const [hair, setHair] = useState(hairs[4])
  const [eye, setEye] = useState(eyes[2])
  return (
    <Container>
      <Row><h2>Anime Face</h2></Row>
      <Row><h4>Generate an anime face by machine. You can specify hair and eye color.</h4></Row>
      <Row>
        <Col>
            <Form.Control as="select" defaultValue={hair} onChange={(e)=>setHair(e.target.value)}>
              {hairs.map((hair, idx)=><option key={idx} value={hair}>{hair}</option>)}
            </Form.Control>
        </Col>
        <Col>
            <Form.Control as="select" defaultValue={eye} onChange={(e)=>setEye(e.target.value)}>
              {eyes.map((eye, idx)=><option key={idx} value={eye}>{eye}</option>)}
            </Form.Control>
        </Col>
      </Row>
        
      <Core mode="anime_heads" cap={`${hair} ${eye}`}/>
    </Container>
  )
}

const Birds = () => {
  const examples = [
	  "this bird has a green crown, black wings and a yellow belly", 
	  "the bird has a yellow crown and a black eyering that is round", 
	  "a small red bird", 
	  "a small orange bird",
    "this bird has wings that are red and has a white belly",
    "this goofy looking bird has a bright red beak and dull white and gray plumage.",
    "this bird is white in color, with a yellow beak.",
    "this bird is red and black in color and has a sharp black beak",
    "a small black bird",
    "a small yellow bird",
  ]
  const [cap, setCap] = useState(examples[0])
  const [itemsCheck, setItemsCheck] = useState(examples.map(_=>false))
  const handleFormChange = (e) => {
    setCap(e.target.value)
    setItemsCheck(itemsCheck.map(_=>false))
  }
  const handleItemClick = (e, idx) => {
    setCap(e.target.value)
    setItemsCheck(
      itemsCheck.map((_, i)=> i === idx ? true : false)
    )
  }
  return (
    <Container>
      <Row><h2>Birds</h2></Row>
      <Row>
        <h4>Generate a bird by machine. You can specify any string that describe a bird.</h4>
        <Alert variant='warning'>
          Note: This is a hard task, so the results are not always good. You need to try more and choose a better one.
        </Alert>
      </Row>
      <Row>
        <Form.Control as="textarea" rows="2" value={cap} onChange={handleFormChange} />
      </Row>
      <Row>
        <Col>
          <ListGroup>
            <ListGroup.Item key={-1} disabled>Examples:</ListGroup.Item>
            {examples.map((example, idx)=>(
              <ListGroup.Item key={idx} action value={example} active={itemsCheck[idx]} onClick={(e)=> handleItemClick(e, idx)}>{example}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Core mode="birds" cap={cap}/>
    </Container>
  )
}

export {AnimeHeads, Birds}
