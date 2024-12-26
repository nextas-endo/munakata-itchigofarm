<?php

require_once('config.php');

if(strcasecmp($contentType, 'application/json') != 0) {
  $content = trim(file_get_contents("php://input"));
  $_POST = json_decode($content, true);

  //If json_decode failed, the JSON is invalid.
  if(!is_array($_POST)){
    throw new Exception('Received content contained invalid JSON!');
  }

  if (!isset($_POST['email']['value']) || !filter_var($_POST['email']['value'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
      'status' => 403,
      'message' => 'メールアドレスが不足しているか、または無効です。再度ご確認お願いします。'
    ]);
  }

  if ($_POST['email']) {
    $to = $_POST['email']['value'];
    $form = $_POST;

    unset($form['acceptance']); // remove acceptance flag
    unset($form['send']); // remove send flag

    $form['name']['value'] = htmlspecialchars($form['name']['value']);
    $form['email']['value'] = filter_var($form['email']['value'], FILTER_SANITIZE_EMAIL);
    $form['tel']['value'] = filter_var($form['tel']['value'], FILTER_VALIDATE_REGEXP, array('options' =>array('regexp' => "/(\d{1,5}-\d{1,4}-\d{4,5})|(\d{9,14})/i")));
    $form['message']['value'] = htmlspecialchars($form['message']['value']);


    if ($form['message']) $form['message']['value'] = '<br>' . $form['message']['value']; // add carriage return for formating clarity

    // To send HTML mail, the Content-type header must be set
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
 
    // Create email headers
    $headers .= 'From: '. $config['from'] . "\r\n" .
                'Reply-To: ' . $from. "\r\n" .
                'X-Mailer: PHP/' . phpversion();

    $subject_admin_txt = $config['subject.prefix'] . $config['subject.admin.txt'];
    $subject_visitor_txt = $config['subject.prefix'] . $config['subject.visitor.txt'];

    $form_fields_output = '';

    foreach ($form as $key => $value) {
      if (is_array($value['value'])) {
        $form_fields_output .= htmlspecialchars($value['label']) . ': ' .  implode('、', $value['value']) . '<br>';
        // return;
      } else {
        $form_fields_output .= htmlspecialchars($value['label']) . ': ' .  nl2br($value['value']) . '<br>';
      }
    }

    $msg_admin_body = $form_fields_output . "    
      <br>
      -- <br>
      このメールは" . $config['subject.prefix'] . "( {$config['site.url']} ) のお問い合わせフォームから送信されました <br>
    ";

    $msg_visitor_body = "
      差出人：{$form['name']['value']} <{$form['email']['value']}> <br>
      題名：" . $config['subject.prefix'] . "：お問い合わせありがとうございます。 <br>
      <br>
      {$config['body.visitor.txt']}
      <br>" . 
      $form_fields_output
      . "<br>
      <br>
      -- <br>
      このメールは" . $config['subject.prefix'] . "( {$config['site.url']} ) のお問い合わせフォームから送信されました <br>
    ";

    // Sendmail
    try {
      mail($config['admin.email'], $subject_admin_txt, $msg_admin_body, $headers);
      mail($to, $subject_visitor_txt, $msg_visitor_body, $headers);

      echo json_encode(['status' => 200, 'send_flag' => 1]);
    } catch(Throwable $th) {
      echo json_encode([
          'status' => 403,
          'message' => '送信エラーが発生しました。お手数ですが、少しお待ちしてからリロードして再度フォームのご入力をお願いします。',
          'error' => $th
      ]);
    }
  }
    
} else {
  return;
}
?>
