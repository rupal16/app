import * as React from 'react';
import { Helmet } from 'react-helmet';
import {IMeetingResult, IMeetingMutation, getMeeting, completeMeeting} from 'apollo/modules/meetings';
import {Question} from 'components/Question';
import 'rc-slider/assets/index.css';
import { Grid, Loader } from 'semantic-ui-react';
import './style.less';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import {IURLConnector} from 'redux/modules/url';
import {IAnswer} from 'models/answer';
import {IQuestion} from 'models/question';
import {QuestionnaireReview} from '../../components/QuestionnaireReview';
const { connect } = require('react-redux');

interface IProps extends IMeetingMutation, IURLConnector {
  data: IMeetingResult;
  params: {
      id: string,
  };
  questions?: IQuestion[];
  answers?: IAnswer[];
}

interface IState {
    currentQuestion?: string;
    finished?: boolean;
    init?: boolean;
}

@connect((_, ownProps: IProps) => {
  const out: any = {};
  if (ownProps.data.getMeeting !== undefined) {
    out.questions = (ownProps.data.getMeeting.outcomeSet.questions || [])
      .filter((q) => !q.archived);
    out.answers = ownProps.data.getMeeting.answers;
  }
  return out;
}, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class MeetingInner extends React.Component<IProps, IState> {

  constructor(props) {
    super(props);
    this.state = {
      currentQuestion: undefined,
      finished: false,
      init: false,
    };
    this.renderFinished = this.renderFinished.bind(this);
    this.goToQuestion = this.goToQuestion.bind(this);
    this.goToReview = this.goToReview.bind(this);
    this.goToNextQuestionOrReview = this.goToNextQuestionOrReview.bind(this);
    this.canGoToPreviousQuestion = this.canGoToPreviousQuestion.bind(this);
    this.goToPreviousQuestion = this.goToPreviousQuestion.bind(this);
    this.completed = this.completed.bind(this);
    this.goToQuestionWithID = this.goToQuestionWithID.bind(this);
  }

  public componentDidUpdate() {
    if (this.props.questions !== undefined && this.state.init === false) {
      this.setState({init: true});
      if (this.props.questions.length <= 0) {
        this.goToReview();
      } else {
        this.goToQuestion(0);
      }
    }
  }

  private goToQuestion(idx: number) {
    let idxx = idx;
    if (idx < 0) {
      idxx = 0;
    }
    if (idx >= this.props.questions.length) {
      idxx = this.props.questions.length - 1;
    }
    const question = this.props.questions[idxx];
    this.setState({
      currentQuestion: question.id,
      finished: false,
    });
  }

  private goToQuestionWithID(qID: string) {
    const idx = this.props.questions.findIndex((q) => q.id === qID);
    this.goToQuestion(idx);
  }

  private completed() {
    this.props.setURL(`/beneficiary/${this.props.data.getMeeting.beneficiary}`, `?q=${this.props.data.getMeeting.outcomeSetID}`);
  }

  private goToReview() {
    this.setState({
      finished: true,
    });
  }

  private goToNextQuestionOrReview() {
    const currentIdx = this.props.questions.findIndex((q) => q.id === this.state.currentQuestion);
    if (this.props.questions.length > currentIdx + 1) {
      this.goToQuestion(currentIdx+1);
    } else {
      this.goToReview();
    }
  }

  private goToPreviousQuestion() {
    if (this.state.finished) {
      return this.setState({
        finished: false,
      });
    }
    const currentIdx = this.props.questions.findIndex((q) => q.id === this.state.currentQuestion);
    if (currentIdx === -1 || currentIdx === 0) {
      return;
    }
    this.goToQuestion(currentIdx-1);
  }

  private canGoToPreviousQuestion(): boolean {
    const currentIdx = this.props.questions.findIndex((q) => q.id === this.state.currentQuestion);
    return currentIdx !== -1 && currentIdx !== 0;
  }

  private renderFinished(): JSX.Element {
    return(
      <QuestionnaireReview
        record={this.props.data.getMeeting}
        onQuestionClick={this.goToQuestionWithID}
        onBack={this.goToPreviousQuestion}
        onComplete={this.completed}
      />
    );
  }

  public render() {
    const wrapper = (inner: JSX.Element): JSX.Element => {
      return (
        <Grid container columns={1} id="meeting">
          <Grid.Column>
            <Helmet>
              <title>Questionnaire</title>
            </Helmet>
            <div id="meeting">
              {inner}
            </div>
          </Grid.Column>
        </Grid>
      );
    };

    const meeting = this.props.data.getMeeting;
    if (meeting === undefined) {
        return wrapper(<Loader active={true} inline="centered" />);
    }
    if (this.state.finished) {
      return wrapper(this.renderFinished());
    }
    const currentQuestionID = this.state.currentQuestion;
    if (currentQuestionID === undefined) {
      return wrapper(<Loader active={true} inline="centered" />);
    }
    return wrapper(<Question
      key={currentQuestionID}
      record={meeting}
      questionID={currentQuestionID}
      showPrevious={this.canGoToPreviousQuestion()}
      onPrevious={this.goToPreviousQuestion}
      onNext={this.goToNextQuestionOrReview}
    />);
  }
}
const Meeting = completeMeeting<IProps>(getMeeting<IProps>((props) => props.params.id)(MeetingInner));
export { Meeting }
